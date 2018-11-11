import * as React from 'react';
import 'Styles/table.less';
import { connect } from 'react-redux';
import MainFooter from 'Partials/MainFooter';
import DashboardButton from '../DashboardButton';
import AutobotHistoryModal from 'Components/AutobotHistoryModal';
import { signOut } from "Partials/MainHeader/actions";
import { history } from 'Components/Routes';
import RoleChangeModal from '../RoleChangeModal';
import AutobotSettingModal from 'Components/AutobotSettingModal';
import Button from 'Elements/Button';
import AutobotTradingModal from 'Components/AutobotTradingModal';
import ExchangePoolModal from 'Components/ExchangePoolModal';
import { showMessage } from 'Components/GlobalMessage/actions';
import { fetchExchangeBalance } from 'Components/AutobotSettingModal/actions';
import { getTradersSetupDetails } from 'Components/SetupDetails/actions';

const styles = require('../dashboard.css');
const innerstyles = require('./exchanges.css');

class Exchanges extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            isOpenHistoryModal: false,
            isOpenSettingModal: false,
            isOnRoleModal: false
        };
    }

    componentWillMount() {
        const { traderSetupData, getTradersSetupDetails, fetchExchangeBalance } = this.props;
        
        fetchExchangeBalance();

        if(!traderSetupData) {
            getTradersSetupDetails();
        }

    }


    onCancelHistoryModal() {
        this.setState({
            isOpenHistoryModal: false,
            isOpenSingleTradeModal: false,
            isOpenMultiTradeModal: false
        });
    }

    openAutobotModal() {
        const { traderSetupData, showMessage } = this.props;

        var setupdetailsdata = traderSetupData && traderSetupData.setupDetails && traderSetupData.setupDetails.data && traderSetupData.setupDetails.data;
        // var exchanges = traderSetupData && traderSetupData.setupDetails && traderSetupData.setupDetails.data && traderSetupData.setupDetails.data.exchangeDetails;
        if(traderSetupData.status.loading) {
            showMessage('Loading Setup Data', 'success', {});
        } else {
            if(setupdetailsdata) {
                if(setupdetailsdata.exchangeDetails && setupdetailsdata.exchangeDetails.length > 0) {
                    if(setupdetailsdata.setupDetails[0].autobot_exchange_account_ids.length > 0) {
                        if(setupdetailsdata.setupDetails[0].autobot_exchange_account_ids.length == 1) {
                            this.setState({
                                isOpenSingleTradeModal: true
                            });
                        } else {
                            this.setState({
                                isOpenMultiTradeModal: true
                            });
                        }
                    } else {
                        this.setState({
                            isOpenSettingModal: true
                        });
                    }
                } else {
                    history.push('/setup-details/traders');
                }
            }
        }
    }

    cancelSingleBotModal() {
        this.setState({
            isOpenSingleTradeModal: false
        });
    }

    cancelMultiBotModal() {
        this.setState({
            isOpenMultiTradeModal: false
        });
    }

    openSettingModal() {
        this.setState({
            isOpenSettingModal: true
        });
    }

    onCancelSettingModal() {
        this.setState({
            isOpenSettingModal: false
        });
    }
    
    goToSetup() {
        history.push('/setup-details/exchanges');
    }

    goToMtr() {
        history.push('/mtr');
    }

    openRoleModal() {
        this.setState({
            isOnRoleModal: true
        });
    }

    onCancelRole(){
        this.setState({
            isOnRoleModal: false
        })
    }

    render() {
        const { token } = this.props;
        let userJson = localStorage.getItem('user');
        let username = JSON.parse(userJson)['name'];

        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth()+1; //January is 0!
        var yyyy = date.getFullYear();
        var dd = ''+day;
        var mm = ''+month;

        if(day<10){
            dd='0'+day;
        }
        if(month<10){
            mm='0'+month;
        }
        var today = dd+'/'+mm+'/'+yyyy;

        var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        var am_pm = date.getHours() >= 12 ? "PM" : "AM";
        var h = hours < 10 ? "0" + hours : hours;
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        // var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        var time = h + ":" + minutes + " " + am_pm;

        return (
            <div className={styles.contentWrapper}>
                {/* <AutobotBillingModal isOpen={true} onCancel={this.onCancelHistoryModal.bind(this)} width="700"/> */}
                {
                this.state.isOpenSettingModal ? <AutobotSettingModal isOpen={true} onCancel={this.onCancelSettingModal.bind(this)} width="700"/> : ''
                }
                <RoleChangeModal isOpen={this.state.isOnRoleModal} onCancel={this.onCancelRole.bind(this)} width="600" />
                <img className={styles.RightImage} src="/public/assets/images/dashboard/rightShape.png" />
                <img className={styles.LeftImage} src="/public/assets/images/dashboard/leftLines.png" />
                <div className={innerstyles.content}>
                    <div className={styles.titleSection}>
                        <div className={styles.firstTitle}>
                            <span className={styles.firstTitleItem + ' ' + styles.mt_10}>Username : {username}</span>
                            <span className={styles.firstTitleItem + ' ' + styles.mt_10}>Date & time : {today} - {time}</span>
                            <span className={styles.firstTitleItem}>
                                User Role : Exchanges
                                <Button className={styles.btn + " medium blue"} onClick={this.openRoleModal.bind(this)}>CHANGE ROLE</Button>
                            </span>                            
                        </div>
                        <div className={styles.secondTitle}>
                            <span>XRR Token Balance :  {(token && token.data && token.data.token_credit) ? token.data.token_credit : '0'} XRR</span>
                        </div>
                        <div className={styles.title}>
                            <span>Dashboard</span>
                        </div>
                    </div>
                    <div className={styles.buttonsContent}>
                        <div className={styles.firstRow}>
                            <DashboardButton img={"/public/assets/images/dashboard/market_maker.png"} title={"Market Maker :"} content={"This is used to automate order book buy/sell transactions on all integrated exchanges."} reportLine={1} />
                            <DashboardButton img={"/public/assets/images/dashboard/reporting.png"} title={"Reporting :"} content={"Transaction reports are kept here for viewing and printing."} reportLine={1} />
                            <DashboardButton img={"/public/assets/images/dashboard/engagement.png"} title={"Engagement :"} content={"Token Owners, Market Makers and Exchanges can communicate here via a 2 way chat to discuss terms of engagement."} reportLine={1} />
                            <DashboardButton img={"/public/assets/images/dashboard/auto_bot.png"} title={"Auto Bot :"} content={"Users engage the preset metrics used by the auto bot on either a single account or multiple accounts."} reportLine={1} onClick={this.openAutobotModal.bind(this)}/>
                        </div>
                        <div className={styles.secondRow}>
                            <DashboardButton img={"/public/assets/images/dashboard/setting.png"} title={"Setting :"} content={"This is where user configurations for all available tools are done."} reportLine={2} onClick={this.openSettingModal.bind(this)}/>
                            {/* <DashboardButton img={"/public/assets/images/dashboard/coin_monitoring_board.png"} title={"Coin Monitoring Board :"} content={"This is for traders who want to enagage in manual trading aided by our dynamic market intelligence results."} reportLine={2} onClick={this.goToMtr.bind(this)}/> */}
                            <DashboardButton img={"/public/assets/images/dashboard/setup.png"} title={"Setup :"} content={"This is where users store their preferred account profiles."} reportLine={2} onClick={this.goToSetup.bind(this)}/>
                            <DashboardButton img={"/public/assets/images/dashboard/vote.png"} title={"Vote :"} content={"Users can vote their exchanges and use Earn&Share to earn XRR."} reportLine={2} />
                        </div>
                    </div>
                </div>
                <MainFooter/>
                {
                    this.state.isOpenSingleTradeModal ? <AutobotTradingModal isOpen={true} onCancel={this.cancelSingleBotModal.bind(this)} width="900" exchangeId={this.state.exchangeId} autobotSetting={this.state.autobotSetting} exchangeAccount={this.state.exchangeAccount}/> : ''
                }
                {
                    this.state.isOpenMultiTradeModal ? <ExchangePoolModal isOpen={true} onCancel={this.cancelMultiBotModal.bind(this)} width="900" exchangeId={this.state.exchangeId} autobotSetting={this.state.autobotSetting} exchangeAccount={this.state.exchangeAccount}/> : ''
                }
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    token: state.shareData.token,
    traderSetupData: state.setupDetails.tradersSetupDetails,
});

const mapDispatchToProps = {
    signOut,
    showMessage,
    getTradersSetupDetails,
    fetchExchangeBalance
};

export default connect(mapStateToProps, mapDispatchToProps)(Exchanges);
