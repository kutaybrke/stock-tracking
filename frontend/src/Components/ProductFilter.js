import React from "react";

const ProductFilter = ({ filterValue, setFilterValue }) => {
    return (
        <div className="filter-container">
            <input
                type="text"
                placeholder="Ürün Kodu ile filtrele"
                value={filterValue}
                onChange={setFilterValue}
            />
        </div>
    );
};

export default ProductFilter;
