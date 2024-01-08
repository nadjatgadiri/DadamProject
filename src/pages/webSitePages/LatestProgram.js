import React, { useState, useEffect } from "react";
import { getLatestPrograms } from '../../RequestManagement/webSiteManagement';

function getRandomImageName() {
    const importAll = (r) => r.keys().map(r);
    const images = importAll(require.context('../../../public/assets/img/progImage', false, /\.(png|jpe?g|svg)$/));
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImageName = images[randomIndex].split('/').pop(); // Extracting just the image file name
    return randomImageName.slice(0, 4);
}
function ProgramSection() {
    const [programs, setPrograms] = useState([]);

    /** api */
    const fetchData = async () => {
        const result = await getLatestPrograms();
        if (result.code === 200) {
            setPrograms(result.programs);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return (
        <>
            {programs.length !== 0 &&
                <div className="untree_co-section bg-light" id="Recent">
                    <div className="container">
                        <div className="row justify-content-center mb-5">
                            <div className="col-lg-7 text-center" data-aos="fade-up" data-aos-delay={0}>
                                <h2 className="line-bottom text-center mb-4">Le Plus Récent</h2>
                            </div>
                        </div>
                        <div className="row">
                            {programs.map((prog, index) => (
                                <div className="col-12 col-sm-6 col-md-6 col-lg-4 mb-4 mb-lg-0" data-aos="flip-up" data-aos-delay={100}>
                                    <div className="custom-media">
                                        <a href="#"><img src={`./assets/img/progImage/${getRandomImageName()}.jpg`} alt="School" className="img-fluid" /></a>
                                        <div className="custom-media-body" >
                                            <h3>{prog.title}</h3>
                                            <p style={{ height: "50px", maxHeight: "50px" }} className="mb-4">{prog.discription.slice(0, 40)} ...</p>
                                            <div className="border-top d-flex justify-content-between pt-3 mt-3 align-items-center">
                                                <div><span className="price">{prog.prix} DA</span></div>
                                                <div><a href={`/home/ProgrammeProfile/${prog.ID_ROWID}`}>Savoir plus</a></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}


                        </div>
                    </div>
                </div>
            }
        </>
    );
}
export default ProgramSection;
