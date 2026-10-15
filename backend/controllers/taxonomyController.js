const Taxonomy = require("../models/Taxonomy");

const ranks = ["kingdom", "phylum", "class", "order", "family", "genus"];

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Check that the selected parent belongs to the correct rank.
const validateParent = async (rank, parentId) => {
    const rankIndex = ranks.indexOf(rank);

    if (rankIndex === -1) {
        return "Invalid taxonomy rank.";
    }

    if (rankIndex === 0) {
        return parentId ? "A kingdom cannot have a parent." : null;
    }

    if (!parentId) {
        return `${rank} must have a ${ranks[rankIndex - 1]} parent.`;
    }

    const parent = await Taxonomy.findById(parentId);

    if (!parent) {
        return "Parent taxonomy was not found.";
    }

    if (parent.rank !== ranks[rankIndex - 1]) {
        return `${rank} must belong to a ${ranks[rankIndex - 1]}.`;
    }

    return null;
};

// GET /api/taxonomy
const getTaxonomies = async (req, res) => {
    try {
        const filter = {};

        if (req.query.rank) {
            if (!ranks.includes(req.query.rank)) {
                return res.status(400).json({ message: "Invalid taxonomy rank." });
            }
            filter.rank = req.query.rank;
        }

        if (req.query.parent === "null") {
            filter.parent = null;
        } else if (req.query.parent) {
            filter.parent = req.query.parent;
        }

        const taxonomies = await Taxonomy.find(filter).populate("parent", "name rank").sort({ name: 1 });

        res.json(taxonomies);
    } catch (error) {
        res.status(400).json({ message: "Failed to retrieve taxonomy.", error: error.message });
    }
};

// GET /api/taxonomy/:id
const getTaxonomyById = async (req, res) => {
    try {
        const taxonomy = await Taxonomy.findById(req.params.id).populate("parent", "name rank");

        if (!taxonomy) {
            return res.status(404).json({ message: "Taxonomy not found." });
        }

        res.json(taxonomy);
    } catch (error) {
        res.status(400).json({ message: "Invalid taxonomy ID." });
    }
};

// POST /api/taxonomy
const createTaxonomy = async (req, res) => {
    try {
        const { name, rank, parent } = req.body;

        if (!name || !rank) {
            return res.status(400).json({ message: "Name and rank are required." });
        }

        const cleanName = name.trim();

        if (!cleanName) {
            return res.status(400).json({ message: "Taxonomy name cannot be empty." });
        }

        const parentError = await validateParent(rank, parent);
        if (parentError) {
            return res.status(400).json({ message: parentError });
        }

        const duplicate = await Taxonomy.findOne({
            name: { $regex: `^${escapeRegex(cleanName)}$`, $options: "i" },
            rank,
            parent: parent || null,
        });

        if (duplicate) {
            return res.status(409).json({ message: "This taxonomy entry already exists under the selected parent." });
        }

        const taxonomy = await Taxonomy.create({
            name: cleanName,
            rank,
            parent: parent || null,
        });

        res.status(201).json(taxonomy);
    } catch (error) {
        res.status(400).json({ message: "Failed to create taxonomy.", error: error.message });
    }
};

// PATCH /api/taxonomy/:id
const updateTaxonomy = async (req, res) => {
    try {
        const taxonomy = await Taxonomy.findById(req.params.id);

        if (!taxonomy) {
            return res.status(404).json({ message: "Taxonomy not found." });
        }

        const name = req.body.name === undefined ? taxonomy.name : req.body.name.trim();
        const rank = req.body.rank === undefined ? taxonomy.rank : req.body.rank;
        const parent = req.body.parent === undefined ? (taxonomy.parent ? taxonomy.parent.toString() : null) : req.body.parent;

        if (!name) {
            return res.status(400).json({ message: "Taxonomy name cannot be empty." });
        }

        const parentError = await validateParent(rank, parent);
        if (parentError) {
            return res.status(400).json({ message: parentError });
        }

        const hasChildren = await Taxonomy.exists({ parent: taxonomy._id });
        const parentChanged = String(parent || "") !== String(taxonomy.parent || "");
        const rankChanged = rank !== taxonomy.rank;

        if (hasChildren && (parentChanged || rankChanged)) {
            return res.status(400).json({
                message: "Cannot change the rank or parent while this entry has children. Update or move its children first.",
            });
        }

        // Prevent a taxonomy entry from becoming its own ancestor.
        let currentParent = parent;
        while (currentParent) {
            if (currentParent === taxonomy._id.toString()) {
                return res.status(400).json({ message: "A taxonomy entry cannot be its own ancestor." });
            }

            const ancestor = await Taxonomy.findById(currentParent).select("parent");

            if (!ancestor) break;
            currentParent = ancestor.parent ? ancestor.parent.toString() : null;
        }

        const duplicate = await Taxonomy.findOne({
            _id: { $ne: taxonomy._id },
            name: { $regex: `^${escapeRegex(name)}$`, $options: "i" },
            rank,
            parent: parent || null,
        });

        if (duplicate) {
            return res.status(409).json({ message: "This taxonomy entry already exists under the selected parent." });
        }

        taxonomy.name = name;
        taxonomy.rank = rank;
        taxonomy.parent = parent || null;

        await taxonomy.save();

        res.json(taxonomy);
    } catch (error) {
        res.status(400).json({ message: "Failed to update taxonomy.", error: error.message });
    }
};

// DELETE /api/taxonomy/:id
const deleteTaxonomy = async (req, res) => {
    try {
        const taxonomy = await Taxonomy.findById(req.params.id);

        if (!taxonomy) {
            return res.status(404).json({ message: "Taxonomy not found." });
        }

        const hasChildren = await Taxonomy.exists({ parent: taxonomy._id });

        if (hasChildren) {
            return res.status(400).json({
                message: "Cannot delete this entry because it has child taxonomy entries. Delete its children first.",
            });
        }

        await taxonomy.deleteOne();

        res.json({ message: "Taxonomy deleted successfully." });
    } catch (error) {
        res.status(400).json({ message: "Failed to delete taxonomy.", error: error.message });
    }
};

const IMPORT_TAXONOMY_RANKS = ["kingdom", "phylum", "class", "order", "family", "genus"];

const importTaxonomyTree = async (req, res) => {
    try {
        const tree = req.body.tree;

        if (!tree || typeof tree !== "object" || Array.isArray(tree) || Object.keys(tree).length === 0) {
            return res.status(400).json({ message: "A taxonomy tree is required." });
        }

        let created = 0;
        let skipped = 0;

        const importBranch = async (branch, rankIndex, parentId = null) => {
            if (!branch || typeof branch !== "object" || Array.isArray(branch)) {
                throw new Error(`Invalid data for rank ${IMPORT_TAXONOMY_RANKS[rankIndex]}.`);
            }

            const rank = IMPORT_TAXONOMY_RANKS[rankIndex];

            for (const [rawName, children] of Object.entries(branch)) {
                const name = rawName.trim();

                if (!name) throw new Error(`Empty name found in rank ${rank}.`);

                let item = await Taxonomy.findOne({
                    rank,
                    parent: parentId,
                    name: { $regex: `^${escapeTaxonomyRegex(name)}$`, $options: "i" },
                });

                if (item) {
                    skipped++;
                } else {
                    item = await Taxonomy.create({
                        name,
                        rank,
                        parent: parentId,
                    });
                    created++;
                }

                if (rankIndex < IMPORT_TAXONOMY_RANKS.length - 1) {
                    if (!children || typeof children !== "object" || Array.isArray(children) || Object.keys(children).length === 0) {
                        throw new Error(`${name} is missing its child taxonomy entries.`);
                    }

                    await importBranch(children, rankIndex + 1, item._id);
                } else if (!Array.isArray(children)) {
                    throw new Error(`Genus ${name} must be a leaf entry.`);
                }
            }
        };

        await importBranch(tree, 0);

        return res.status(200).json({
            message: "Taxonomy import completed.",
            created,
            skipped,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Taxonomy import failed.",
        });
    }
};

module.exports = {
    getTaxonomies,
    getTaxonomyById,
    createTaxonomy,
    updateTaxonomy,
    deleteTaxonomy,
    importTaxonomyTree,
};
