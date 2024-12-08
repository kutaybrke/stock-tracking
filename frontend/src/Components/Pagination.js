import React from "react";
import "../style/Pagination.css";

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Sayfa numaraları 5li grup
    const currentGroupStart = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const currentGroupEnd = Math.min(currentGroupStart + 4, totalPages);

    const pageNumbers = [];
    for (let i = currentGroupStart; i <= currentGroupEnd; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            {/* Geri butonu */}
            <button
                className={`pagination-arrow ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
            >
                {"<"}
            </button>

            {/* Önceki grup butonu */}
            {currentGroupStart > 1 && (
                <button
                    className="pagination-arrow"
                    onClick={() => paginate(currentGroupStart - 1)}
                >
                    {"<<"}
                </button>
            )}

            {/* Sayfa numaraları */}
            {pageNumbers.map((number) => (
                <button
                    key={number}
                    className={`pagination-button ${currentPage === number ? "active" : ""}`}
                    onClick={() => paginate(number)}
                >
                    {number}
                </button>
            ))}

            {/* Sonraki grup butonu */}
            {currentGroupEnd < totalPages && (
                <button
                    className="pagination-arrow"
                    onClick={() => paginate(currentGroupEnd + 1)}
                >
                    {">>"}
                </button>
            )}

            {/* İleri butonu */}
            <button
                className={`pagination-arrow ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                {">"}
            </button>
        </div>
    );
};

export default Pagination;
