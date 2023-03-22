import "~/components/buttons/all-settings-button.css"
function AllSettingsButton() {
    function handleClick() {
        chrome.runtime.openOptionsPage();
      }

    return (
        <a className="all-settings-wrapper" onClick={handleClick}>
            <span className="all-settings">All Settings</span>
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 1H2.5C1.39543 1 0.5 1.89543 0.5 3V9C0.5 10.1046 1.39543 11 2.5 11H8.5C9.60457 11 10.5 10.1046 10.5 9V7.5M5.5 6L10.5 1M10.5 1H6.5M10.5 1V5" stroke="#4A6EE0" stroke-linecap="round"></path>
            </svg>
        </a>
    );
}

export default AllSettingsButton