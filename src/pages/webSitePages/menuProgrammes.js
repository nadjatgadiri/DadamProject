import React from "react";

function getRandomImageName() {
    const importAll = (r) => r.keys().map(r);
    const images = importAll(require.context('../../../public/assets/img/progImage', false, /\.(png|jpe?g|svg)$/));
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImageName = images[randomIndex].split('/').pop(); // Extracting just the image file name
    return randomImageName.slice(0, 4);
}
function formatDate(inputDate) {
    const date = new Date(inputDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}
export default function MenuProgrammes(props) {
    const { programs = {} } = props;
    return (
        <>
            <div className="container" style={{ paddingTop: "40px" }}>
                <div className="row align-items-stretch">
                    {programs.map((prog) => (
                        <div className="col-sm-12 col-md-12 col-lg-6 mb-6" data-aos="flip-up" data-aos-delay={100}>
                            <div className="media-h d-flex">
                                <figure>
                                    <img src={`../../assets/img/progImage/${getRandomImageName()}.jpg`} alt="" />
                                </figure>
                                <div className="media-h-body">
                                    <h2 className="mb-3"><a className="hover-link" href={`/home/ProgrammeProfile/${prog.ID_ROWID}`}>{prog.title}</a></h2>
                                    <div className="meta mb-2"><span className="icon-calendar mr-2" /><span>{formatDate(prog.PublishedDate)}</span></div>
                                    {/*  150 */}<p>{prog.discription.slice(0, 150)} ...</p>
                                    <p><a className="hover-link" href={`/home/ProgrammeProfile/${prog.ID_ROWID}`}>Learn More</a></p>
                                </div>
                            </div>
                        </div>
                    ))}


                </div>

            </div > {/* /.untree_co-section */}
        </>

    );
}