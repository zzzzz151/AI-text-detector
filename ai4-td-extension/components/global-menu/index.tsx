import { useStorage } from "@plasmohq/storage/hook";
import { useEffect, useState } from "react";
import GlobalButton from "~components/global-button";
import GlobalCard from "~components/global-card";
import GlobalCardError from "~components/global-card-error";
import useReadyState from "~components/hooks/ready";
import { analysePage, cleanPage } from "~resources/utils";

function GlobalMenu() {
    const [is, setSuccess, setError, setLoading, _, reload] = useReadyState();
    const [anchor, setAnchor] = useState(false);
    const [data, setData] = useState(null);
    const [autoscan] = useStorage<boolean>("scan-page-automatically");
    const [languageModel] = useStorage<string>("model", v => v ?? process.env.PLASMO_PUBLIC_DEFAULT_MODEL);
 
    const isReloading = is("reload");
    const isDefault = is("default");
    const isSuccess = is("success");
    const isError = is("error");
    const isLoading = is("loading");
    
    const handleClick = () => {
        if (isDefault || isReloading) {
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
        setAnchor(false);
        reload();
    };

    useEffect(() => {
        if (isReloading) {
            cleanPage();  
            handleClick();
        }
    }, [isReloading]);

    useEffect(() => {
        if (autoscan && isDefault) {
          handleClick();
        }
    }, [autoscan]);
    
    return (
        <>
            <GlobalButton
                onClick={handleClick}
                success={isSuccess}
                error={isError}
                loading={isLoading}
            />
            {isSuccess && anchor && <GlobalCard data={data} onReloadClick={handleReloadClick} />}
            {isError && anchor && <GlobalCardError error={"Oops! Something went wrong."} onReloadClick={handleReloadClick} />}
        </>
    );
}

export default GlobalMenu