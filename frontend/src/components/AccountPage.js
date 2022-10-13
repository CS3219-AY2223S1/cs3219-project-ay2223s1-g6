import SignupPage from './SignupPage';
import ChangePwPage from './ChangePwPage';
import DeleteAccPage from './DeleteAccPage';

function AccountPage(props) {
    const {mode, username, setUsername} = props;

    return (
        mode === 'signUp'
        ? <SignupPage setUsername={setUsername} />
        : mode === 'changePw'
        ? <ChangePwPage username={username} setUsername={setUsername} />
        : mode === 'deleteAcc'
        ? <DeleteAccPage username={username} setUsername={setUsername} />
        : <SignupPage setUsername={setUsername} />
    );
}

export default AccountPage;
