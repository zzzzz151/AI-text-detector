import { useState } from "react";
import React from 'react';


function LMCard( props ) {
    const [navbar, setLMCard] = useState(false);

    const [like, setLike] = useState(0),
    [isLike, setIsLike] = useState(false),

    onLikeButtonClick = () => {
        setLike(like + (isLike ? -1 : 1));
        setIsLike(!isLike);
        if (isDisLike) {
            setDislike(dislike + (isDisLike ? -1 : 1));
            setIsDislike(!isDisLike);
        }
    }

    const [dislike, setDislike] = useState(0),
    [isDisLike, setIsDislike] = useState(false),

    onDislikeButtonClick = () => {
        setDislike(dislike + (isDisLike ? -1 : 1));
        setIsDislike(!isDisLike);
        if (isLike) {
            setLike(like + (isLike ? -1 : 1));
            setIsLike(!isLike);
        }
    }

    return (
        <div className="card card-side bg-base-100 shadow-xl pt-100 border-gray-300 justify-content">
            <figure className="bg-slate-200 w-40"><div className="radial-progress text-primary bg-slate-200" style={{"--value":props.score}}>{props.score}%</div></figure>
            <div className="card-body">
                <h2 className="card-title">Language Model!</h2>
                <p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</p>
                <div className="card-actions justify-end">
                    <i style={{fontSize: "30px", paddingTop: "25px", color: (isLike ? "green" : "black")}} class="fa fa-thumbs-o-up" onClick={onLikeButtonClick} ></i>
                    <p style={{paddingTop: "28px"}}>{like}</p>
                    <i style={{fontSize: "30px", paddingTop: "25px", color: (isDisLike ? "red" : "black")}} class="fa fa-thumbs-o-down" onClick={onDislikeButtonClick} ></i>
                    <p style={{paddingTop: "28px"}}>{dislike}</p>
                    {/* The button to open modal */}
                    <label htmlFor="my-modal2" className="btn btn-primary">See More</label>

                    {/* Put this part before </body> tag */}
                    <input type="checkbox" id="my-modal2" className="modal-toggle" />
                    <div className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">More details:</h3>
                            <p className="py-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc quis nisi libero. Morbi sed ultrices lorem, a tristique justo. Curabitur maximus nibh augue, ut feugiat nisl efficitur ac. Mauris et eleifend dui. Cras condimentum mauris sed tellus eleifend, eu fringilla eros mattis. Aliquam erat volutpat. Fusce vestibulum pellentesque posuere. Aliquam id lobortis nisi. Sed finibus tempus efficitur. Integer aliquet sit amet eros id euismod. </p>
                            <div className="modal-action">
                                <label htmlFor="my-modal2" className="btn btn-primary">Yay!</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LMCard;


