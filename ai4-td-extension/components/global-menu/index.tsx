import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";
import GlobalButton from "~components/global-button";
import GlobalCard from "~components/global-card";
import GlobalCardError from "~components/global-card-error";
import { analysePage, cleanPage } from "~resources/utils";

function GlobalMenu() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [anchor, setAnchor] = useState(false);
    const [data, setData] = useState(null);
    const [reload, setReload] = useState(false);
    const [autoscan] = useStorage<boolean>("scan-page-automatically");
    const [languageModel] = useStorage<string>("language-model", v => v ?? 'openai-roberta-base');
 
    const canScan = !(loading || success || error);

    const handleClick = () => {
        if (canScan) {
            setLoading(true);
            analysePage(languageModel)
            .then(data => {
                if (!data) {
                    throw new Error('No data returned from API.');
                }
                setSuccess(true);
                setData(data)
            })
            .catch(() => {
                setError(true);
            })
            .finally(() => {
                setAnchor(true);
                setLoading(false);
            })
        }
        else {
            setAnchor(prevState => !prevState);
        }
    };

    /* Could have problems */
    const handleReloadClick = () => {
        setSuccess(false);
        setError(false);
        setAnchor(false);
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
            {error && anchor && <GlobalCardError error={"Some error happened"} onReloadClick={handleReloadClick} />}
        </>
    );
}

export default GlobalMenu