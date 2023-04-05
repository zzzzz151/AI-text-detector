import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";
import GlobalButton from "~components/global-button";
import GlobalCard from "~components/global-card";
import GlobalCardError from "~components/global-card-error";
import useReadyState from "~components/hooks/ready";
import { analysePage, cleanPage } from "~resources/utils";

function GlobalMenu() {
    const [is, setSuccess, setError, setLoading, reset] = useReadyState();
    const [anchor, setAnchor] = useState(false);
    const [data, setData] = useState(null);
    const [reload, setReload] = useState(false);
    const [autoscan] = useStorage<boolean>("scan-page-automatically");
    const [languageModel] = useStorage<string>("language-model", v => v ?? 'openai-roberta-base');
 
    const canScan = is("default");

    const handleClick = () => {
        if (canScan) {
            setLoading();
            analysePage(languageModel)
            .then((data: number) => {
                if (data === null || data === undefined || isNaN(data)) {
                    throw new Error('No data returned from API.');
                }
                setSuccess();
                setData(data)
            })
            .catch(() => {
                setError();
            })
            .finally(() => {
                setAnchor(true);
            })
        }
        else {
            setAnchor(prevState => !prevState);
        }
    };

    /* Could have problems */
    const handleReloadClick = () => {
        reset();
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
                is={is}
            />
            {is("success") && anchor && <GlobalCard data={data} onReloadClick={handleReloadClick} />}
            {is("error") && anchor && <GlobalCardError error={"Some error happened"} onReloadClick={handleReloadClick} />}
        </>
    );
}

export default GlobalMenu