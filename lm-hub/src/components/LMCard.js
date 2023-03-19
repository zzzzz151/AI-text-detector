import { useState } from "react";


function LMCard( props ) {
    const [navbar, setLMCard] = useState(false);

    return (
        <div className="card card-side bg-base-100 shadow-xl pt-100 border-gray-300 justify-content">
            <figure className="bg-slate-200 w-40"><div className="radial-progress text-primary bg-slate-200" style={{"--value":props.score}}>{props.score}%</div></figure>
            <div className="card-body">
                <h2 className="card-title">Language Model!</h2>
                <p>Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...</p>
                <div className="card-actions justify-end">
                <button type="button" class="text-red-700 border border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800 dark:hover:bg-red-500">
                    <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" clip-rule="evenodd"></path></svg>
                    <span class="sr-only">Icon description</span>
                </button>
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