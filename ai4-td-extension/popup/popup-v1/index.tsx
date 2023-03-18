import React from "react";
import "~popup/base.css"
import "~popup/popup-v1/style.css"
import Switcher from "../switchers/switcher";
import { Divider, Grid } from "@mui/material";

function IndexPopupV1() {

  return (
    <div className="popux-box">
        <div className="popup-wrapper">
            <div className="popup-header">
                <a className="title">Project Name and Logo</a>
            </div>
            <Grid container className="popup-main">
                <div className="row">
                    <Grid xs={12} className="settings-header">
                        <div className="qck-settings">Quick Settings</div>
                        <button className="white-button">
                          <div className="all-settings-wrapper">
                            <span className="all-settings">All Settings</span>
                            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="all-settings-icon">
                                <path d="M4 1H2.5C1.39543 1 0.5 1.89543 0.5 3V9C0.5 10.1046 1.39543 11 2.5 11H8.5C9.60457 11 10.5 10.1046 10.5 9V7.5M5.5 6L10.5 1M10.5 1H6.5M10.5 1V5" stroke="#4A6EE0" stroke-linecap="round"></path>
                            </svg>
                          </div>
                        </button>
                    </Grid>
                </div>
                <Grid container direction={"column"} className="options">
                    <div className="row option">
                      <Grid xs={9} textAlign="left">
                        <div className="grey-box loading"></div>
                      </Grid>
                      <Grid xs={3} textAlign="right">
                          <Switcher />
                      </Grid>
                    </div>
                    <Divider sx={{margin: "1rem 0"}} />
                    <div className="row option">
                      <Grid xs={9} textAlign="left">
                        <div className="grey-box loading"></div>
                      </Grid>
                      <Grid xs={3} textAlign="right">
                          <Switcher />
                      </Grid>
                    </div>
                    <Divider sx={{margin: "1rem 0"}} />
                    <div className="row option">
                      <Grid xs={9} textAlign="left">
                        <div className="grey-box loading"></div>
                      </Grid>
                      <Grid xs={3} textAlign="right">
                          <Switcher />
                      </Grid>
                    </div>
                    <Divider sx={{margin: "1rem 0"}} />
                    <div className="row option">
                      <Grid xs={9} textAlign="left">
                        <div className="grey-box loading"></div>
                      </Grid>
                      <Grid xs={3} textAlign="right">
                          <Switcher />
                      </Grid>
                    </div>
                    <Divider sx={{margin: "1rem 0"}} />
                    <div className="row option">
                      <Grid xs={9} textAlign="left">
                        <div className="grey-box loading"></div>
                      </Grid>
                      <Grid xs={3} textAlign="right">
                          <Switcher />
                      </Grid>
                    </div>
                    <Divider sx={{margin: "1rem 0"}} />
                    <div className="row option">
                      <Grid xs={9} textAlign="left">
                        <div className="grey-box loading"></div>
                      </Grid>
                      <Grid xs={3} textAlign="right">
                          <Switcher />
                      </Grid>
                    </div>
                </Grid>
            </Grid>
            <Grid container className="popup-footer">
                <div className="footer-item">
                    <div className="footer-item-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3zM17,17H7v-2h10V17zM17,13H7v-2h10V13zM17,9H7V7h10V9z"></path>
                        </svg>                          
                    </div>
                    Scan text
                </div>
                <div className="footer-item">
                    <div className="footer-item-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12,2.5c-5.25,0-9.5,4.25-9.5,9.5c0,4.46,3.25,8.17,7.5,8.95v-1.89c-2.89-0.77-5-3.41-5-6.56c0-3.71,3.03-6.75,6.75-6.75c3.71,0,6.75,3.03,6.75,6.75c0,3.15-2.11,5.79-5,6.56v1.89c4.25-0.78,7.5-4.49,7.5-8.95C21.5,6.75,17.25,2.5,12,2.5z M12,15.25c-1.93,0-3.5-1.57-3.5-3.5c0-1.93,1.57-3.5,3.5-3.5s3.5,1.57,3.5,3.5C15.5,13.68,13.93,15.25,12,15.25z"></path>
                          </svg>                        
                    </div>
                    Our Website
                </div>
            </Grid>
        </div>
      </div>
  )
}

export default IndexPopupV1
