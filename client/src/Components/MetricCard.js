// client/src/components/MetricCard.js

import React from 'react';

function MetricCard({ title, value, icon, color }) {
    // Note: The icon here should be a simple character or a Lucide icon component 
    // passed as a prop from Dashboard.js (using children is usually best for icons)
    return (
        <div className="metric-card">
            <div className="card-icon-wrapper" style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className="card-info">
                <p className="metric-value">{value}</p>
                <h4 className="metric-title">{title}</h4>
            </div>
        </div>
    );
}

export default MetricCard;