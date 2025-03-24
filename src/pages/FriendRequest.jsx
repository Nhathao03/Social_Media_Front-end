import Header from "../layout/Header";
import LeftSidebar from "../layout/LeftSidebar";
import RightSidebar from "../layout/RightSidebar";
import Footer from "../layout/Footer";

export default function FriendRequest() {
    return (
        <div className="wrapper">
            <Header />
            <LeftSidebar />
            <RightSidebar />
            <div id="content-page" className="content-page">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <ListRequest/>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

const ListRequest = () => {
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between">
                <div className="header-title">
                    <h4 className="card-title">Friend Request</h4>
                </div>
            </div>
            <div className="card-body">
                <ul className="request-list list-inline m-0 p-0">
                    <li className="d-flex align-items-center  justify-content-between flex-wrap">
                        <div className="user-img img-fluid flex-shrink-0">
                            <img src="./src/assets/images/user/05.jpg" alt="story-img" className="rounded-circle avatar-40" />
                        </div>
                        <div className="flex-grow-1 ms-3">
                            <h6>Jaques Amole</h6>
                            <p className="mb-0">40  friends</p>
                        </div>
                        <div className="d-flex align-items-center mt-2 mt-md-0">
                            <div className="confirm-click-btn">
                                <button onClick={handleConfirm} className="me-3 btn btn-primary rounded confirm-btn">Confirm</button>
                                
                            </div>
                            <a href="#" className="btn btn-secondary rounded" data-extra-toggle="delete" data-closest-elem=".item">Delete Request</a>
                        </div>
                    </li>
                    <li className="d-block text-center mb-0 pb-0">
                        <a href="#" className="me-3 btn">View More Request</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}