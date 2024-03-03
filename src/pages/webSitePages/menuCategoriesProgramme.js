import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { List, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Item from "./itemsRow";
import { getProgramsForCat, getPrograms, listCategoriesForSpecificOpenMainCategory, getCatPath } from '../../RequestManagement/webSiteManagement';
import MenuProgrammes from './menuProgrammes'
import FooterSection from './footer'
import NavSection from './nav'

export default function CategoryList(props) {
    const { catId = 0 } = useParams();
    const [categories, setCategories] = useState({});
    const [programs, setPrograms] = useState([]);
    const [categoryPath, setCategoryPath] = useState([]);
    const [showMenu, setShowMenu] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const fetchData = async () => {
        const result = await listCategoriesForSpecificOpenMainCategory(catId);
        if (result.code === 200) {
            setCategories(result.categories);
        }
        const result2 = await getPrograms();
        if (result2.code === 200) {
            setPrograms(result2.programs);
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        fetchData();

        const handleResize = () => {
            setShowMenu(window.innerWidth > 1524);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [catId]);

    const handleGetData = async (idCat, title) => {
        const result = await getProgramsForCat(idCat);
        if (result.code === 200) {
            setPrograms(result.programs);
        }
        const result2 = await getCatPath(idCat);
        if (result2.code === 200) {
            setCategoryPath(result2.categoryPath);
        }
    };

    const handleSearchInput = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearch = () => {
        setIsSearching(true);
        if (searchInput.trim() === '') {
            setSearchResults([]);
            setIsSearching(false); // Reset isSearching state
        } else {
            const results = programs.filter(program => program.title.toLowerCase().includes(searchInput.toLowerCase()));
            setSearchResults(results);
        }
    };
    
    return (
        <>
            <div className="site-mobile-menu">
                <div className="site-mobile-menu-header">
                    <div className="site-mobile-menu-close">
                        <span className="icofont-close js-menu-toggle" />
                    </div>
                </div>
                <div className="site-mobile-menu-body" />
            </div>
            <NavSection />
            <div className="untree_co-hero overlay"
                style={{ backgroundImage: 'url("../../assets/img/cat.jpg")' }}
            >
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-12">
                            <div className="row justify-content-center ">
                                <div className="col-lg-10 text-center ">
                                    <h1 className="mb-4 heading text-white" data-aos="fade-up" data-aos-delay={100}>Explorez Notre Éventail de Programmes</h1>
                                    <p className="caption mb-4 d-inline-block" data-aos="fade-up" data-aos-delay={100}>
                                        Plongez au cœur de notre école et découvrez notre large éventail de programmes éducatifs, conçus pour stimuler la croissance intellectuelle, le développement personnel et l'épanouissement de nos étudiants.
                                    </p>
                                    <div className="explore-input" style={{ marginTop: "20px" }}>
                                        <input
                                            type="text"
                                            placeholder="Explorez les programmes..."
                                            value={searchInput}
                                            onChange={handleSearchInput}
                                            style={{ width: "300px", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", marginRight: "10px" }}
                                        />
                                        <button className="explore-btn" onClick={handleSearch} style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#f0ad4e", color: "#fff", border: "none", cursor: "pointer" }}>Explorer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> {/* /.row */}
                </div> {/* /.container */}
            </div>
            {isSearching && searchResults.length === 0 && (
                <div style={{ padding: "30px", textAlign: "center" }}>
                    <h3>Aucun programme trouvé pour votre recherche.</h3>
                </div>
            )}
            {searchResults.length === 0 && !isSearching && (
                <div style={{ padding: "30px" }}>
                    <div className="row align-items-stretch " >
                        {showMenu ? (
                            <div className="col-sm-3 col-md-3 col-lg-3 mb-3" style={{ paddingLeft: "40px" }}>
                                <List
                                    className="category2"
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                >
                                    {Object.values(categories).map((cat) => (
                                        <Item key={cat.ID_ROWID} row={cat} handelUploudData={handleGetData} />
                                    ))}
                                </List>
                            </div>
                        ) : (
                            <Drawer
                                anchor="left"
                                open={isOpen}
                                onClose={toggleMenu}
                                PaperProps={{
                                    style: {
                                        backgroundColor: '#da9938',
                                    },
                                }}
                            >
                                <List
                                    className="category2"
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                >
                                    {Object.values(categories).map((cat) => (
                                        <Item key={cat.ID_ROWID} row={cat} handelUploudData={handleGetData} />
                                    ))}
                                </List>
                            </Drawer>
                        )}
                        <div className={`${showMenu ? "col-sm-8 col-md-8 col-lg-9 mb-9" : "col-sm-12 col-md-12 col-lg-12 mb-12"}`}>
                            <div style={{ paddingLeft: "40px", fontSize: "20px" }}>
                                <div className="inline-container" style={{ display: "flex", alignItems: "center" }}>
                                    {!showMenu && (
                                        <IconButton onClick={toggleMenu}>
                                            <MenuIcon />
                                        </IconButton>
                                    )}
                                    <div className="meta mb-3" style={{ fontSize: "20px", marginLeft: "5px", paddingTop: "10px" }}>
                                        <p style={{ margin: 0 }}>
                                            {categoryPath.length !== 0 &&
                                                categoryPath.map((path, index) => (
                                                    <span key={index}>/{path.title}</span>
                                                ))
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="row justify-content-center ">
                                    <div className="col-lg-5 text-center" data-aos="fade-up" data-aos-delay={0}>
                                        <h2 className="line-bottom text-center mb-4">Liste Des Programmes</h2>
                                    </div>
                                </div>
                            </div>
                            <MenuProgrammes programs={searchInput.trim() === '' ? programs : searchResults} />
                        </div>
                    </div>
                </div>
            )}
            {searchResults.length > 0 && (
                <div style={{ padding: "30px" }}>
                        <div className="row justify-content-center ">
                                    <div className="col-lg-5 text-center" data-aos="fade-up" data-aos-delay={0}>
                                        <h2 className="line-bottom text-center mb-4">Résultats de recherche</h2>
                                    </div>
                                </div>
                    <MenuProgrammes programs={searchResults} />
                </div>
            )}
            <FooterSection />
        </>
    );
}
