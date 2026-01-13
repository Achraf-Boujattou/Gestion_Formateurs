import React from 'react';
import './Skeleton.css';

// Skeleton Card for loading states
export const SkeletonCard = ({ lines = 3 }) => (
    <div className="skeleton-card">
        <div className="skeleton-header">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-title-group">
                <div className="skeleton-title"></div>
                <div className="skeleton-subtitle"></div>
            </div>
        </div>
        <div className="skeleton-body">
            {[...Array(lines)].map((_, i) => (
                <div key={i} className="skeleton-line" style={{ width: `${85 - i * 15}%` }}></div>
            ))}
        </div>
        <div className="skeleton-footer">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
        </div>
    </div>
);

// Skeleton Table Row
export const SkeletonRow = ({ cols = 5 }) => (
    <tr className="skeleton-row">
        {[...Array(cols)].map((_, i) => (
            <td key={i}>
                <div className="skeleton-cell" style={{ width: `${60 + Math.random() * 30}%` }}></div>
            </td>
        ))}
    </tr>
);

// Skeleton Stats Card
export const SkeletonStat = () => (
    <div className="skeleton-stat">
        <div className="skeleton-stat-icon"></div>
        <div className="skeleton-stat-info">
            <div className="skeleton-stat-value"></div>
            <div className="skeleton-stat-label"></div>
        </div>
    </div>
);

export default { SkeletonCard, SkeletonRow, SkeletonStat };
