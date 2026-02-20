import { useState, useMemo } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import formatTreeViewItems from '../utils/jsonTreeFormatter';

export default function JsonSelector({fetchedJson, setNewSvcJson, setNewSvcExpected}) {
    // Format JSON object for TreeView
    const items = useMemo(() => formatTreeViewItems(fetchedJson), [fetchedJson]);

    // Handlers for selecting JSON path
    // Build id-item map for JSON select path & value lookup (w/ O(1) time)
    const idToItem = useMemo(() => {
        const map = new Map();
        const visit = (node) => {
            map.set(node.id, node);
            if (node.children) node.children.forEach(visit);
        };
        items.forEach(visit);
        return map;
    }, [items]);

    // Set service path and expected value from selection
    const handleJsonSelect = (event, itemId, isSelected) => {
        if (!isSelected) return;   // ignore deselection

        const item = idToItem.get(itemId);
        if (!item) return;   // ignore failure to find item

        if (!item.isLeaf) {
            setNewSvcJson('');
            setNewSvcExpected('');
            return;
        }
        setNewSvcJson(item.path);
        setNewSvcExpected(item.value);
    };

    // Handlers for keeping only latest expanded node open
    const [expandedIds, setExpandedIds] = useState([]);

    function getAncestorsFromDotPath(id) {
        if (!id) return [];
        const parts = id.split('.');
        const ancestors = [];
        for (let i = 0; i < parts.length; i++) {
            ancestors.push(parts.slice(0, i + 1).join('.'));
        }
        return ancestors;
    }

    const handleItemExpansionToggle = (event, itemId, isExpanded) => {
        if (isExpanded) {
            const branch = getAncestorsFromDotPath(itemId);
            setExpandedIds(branch);
        } else {
            // Remove on collapse
            setExpandedIds((prev) => prev.filter((id) => id !== itemId));
        }
    };

    return (
        <RichTreeView 
            items={items}
            expandedItems={expandedIds}
            onItemExpansionToggle={handleItemExpansionToggle}
            onItemSelectionToggle={handleJsonSelect}
        />
    );
}