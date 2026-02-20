const DEFAULT_ROOT = 'root';

function isPrimitive(value) {
    return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

const makeIdFromPath = (pathArr, fallback = DEFAULT_ROOT) => pathArr.join('.') || fallback;

const primitiveToString = (value) => {
    if (value === null) return 'null';
    if (typeof value === 'string') return JSON.stringify(value);
    return String(value);
}

// Convert JSON into RichTreeView items
export default function formatTreeViewItems(value, rootLabel = DEFAULT_ROOT) {
    // Build a TreeItem for a node at a given path
    const buildItem = (node, pathArr, keyForLabel) => {
        const id = makeIdFromPath(pathArr);

        // Top-level is primitive: return a single leaf
        if (isPrimitive(node)) {
            return {
                id,
                label: `${pathArr[pathArr.length - 1]}: ${primitiveToString(node)}`,
                path: id,
                value: node,
                isLeaf: true,
            };
        }
        
        // Top-level is an array: return one item per index
        if (Array.isArray(node)) {
            const children = node.map((child, index) => {
                const childPath = [...pathArr, String(index)];

                if (isPrimitive(child)) {
                    return {
                        id: makeIdFromPath(childPath, rootLabel),
                        label: `[${index}] = ${primitiveToString(child)}`,
                        path: makeIdFromPath(childPath, rootLabel),
                        value: child,
                        isLeaf: true,
                    };
                }
                return buildItem(child, childPath, `[${index}]`);
            });

            return {
                id,
                label: keyForLabel ?? rootLabel,
                isLeaf: children.length === 0,
                children,
            };
        }

        // Node is an object
        if (typeof node == 'object') {
            const entries = Object.entries(node);

            // Treat an empty object as a terminal leaf
            if (entries.length === 0) {
                return {
                    id,
                    label: keyForLabel != null ? `${keyForLabel}: {}` : '{}',
                    value: {},
                    isLeaf: true,
                };
            }

            const children = entries.map(([key, val]) => {
                const childPath = [...pathArr, key];

                // If child is primitive, render directly instead of recursing
                if (isPrimitive(val)) {
                    return {
                        id: makeIdFromPath(childPath, rootLabel),
                        label: `${key}: ${primitiveToString(val)}`,
                        path: makeIdFromPath(childPath, rootLabel),
                        value: val,
                        isLeaf: true,
                    };
                }

                return buildItem(val, childPath, key);
            });

            return {
                id,
                label: keyForLabel ?? rootLabel,
                isLeaf: false,
                children,
            };
        }

        // Fallback if JSON is invalid
        return {
            id,
            label: keyForLabel != null ? `${keyForLabel}: ${String(node)}` : String(node),
            path: id,
            value: node,
            isLeaf: true,
        };
    };

    // // Return an array of root items as expected by RichTreeView
    // const rootPath = [];
    // const rootNode = buildItem(value, rootPath, rootLabel);
    // return [rootNode];

    // Top-level shaping
    // Top-level is an object: return one item per key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return Object.entries(value).map(([key, val]) => buildItem(val, [key], key));
    }
    // Top-level is an array: return one item per index
    if (Array.isArray(value)) {
        return value.map((val, idx) => buildItem(val, [String(idx)], `[${idx}]`));
    }
    // Top-level is primitive: return single item
    return [buildItem(value, [], null)];
}