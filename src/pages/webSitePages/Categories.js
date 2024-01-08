import React, { useState, useEffect } from "react";
import { Icon, InlineIcon, } from '@iconify/react';
import { getPrincipaleCategories } from '../../RequestManagement/webSiteManagement';

function CategoriesSection() {
    const [categories, setCategories] = useState([]);

    /** api */
    const fetchData = async () => {
        const result = await getPrincipaleCategories();
        if (result.code === 200) {
            setCategories(result.categories);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            <div className="untree_co-section" id="categpry">
                <div className="container">
                    <div className="row justify-content-center mb-3">
                        <div className="col-lg-7 text-center" data-aos="fade-up" data-aos-delay={0}>
                            <h2 className="line-bottom text-center mb-4">Explorer Les Catégories Principales</h2>
                        </div>
                    </div>
                    <div className="row align-items-stretch">
                        {categories.map((cat) => (
                            <div key={cat.ID_ROWID} className="col-sm-6 col-md-6 col-lg-3 mb-4" data-aos="fade-up" data-aos-delay={0}>
                                <a href={`home/categories/${cat.ID_ROWID}`} className="category d-flex align-items-center h-100">
                                    <div>
                                        <InlineIcon className="icon" icon={cat.icon} />

                                    </div>
                                    <div>
                                        <h3>{cat.title}</h3>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                    <div className="row justify-content-center" data-aos="fade-up" data-aos-delay={400}>
                        <div className="col-lg-8 text-center">
                            <p>Il y a plus de catégories disponibles ici.  <a href="home/categories/0">Parcourir tout</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CategoriesSection;
