import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";
import GlobalButton from "~components/global-button";
import GlobalCard from "~components/global-card";
import { analysePage, cleanPage } from "~resources/utils";

function GlobalMenu() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [anchor, setAnchor] = useState(false);
    const [data, setData] = useState(null);
    const [reload, setReload] = useState(false);
    const [autoscan] = useStorage<string>("scan-page-automatically")

    const canScan = !(loading || success || error);

    const handleClick = () => {
        if (canScan) {
            setLoading(true);
            analysePage()
            .then(data => {
                if (!data) {
                    throw new Error('No data returned from API.');
                }
                setSuccess(true);
                setData(data)
                setAnchor(true);
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setLoading(false);
            })
        }
        else {
            setAnchor(prevState => !prevState);
        }
    };

    const handleReloadClick = () => {
        setAnchor(false);
        setSuccess(false);
        setError(false);
        setReload(true);
    };

    useEffect(() => {
        if (reload) {
            setReload(false);
            cleanPage();  
            handleClick();
        }
      }, [reload]);

    useEffect(() => {
        if (autoscan && canScan) {
          handleClick();
        }
    }, [autoscan]);

    return (
        <>
            <GlobalButton
                onClick={handleClick}
                success={success}
                error={error}
                loading={loading}
            />
            {success && anchor && <GlobalCard data={data} onReloadClick={handleReloadClick} />}
        </>
    );
}

export default GlobalMenu