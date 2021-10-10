import ReactDOM from 'react-dom';
import AdminApp from './admin';

// ----------------------------------------------------------------------
if(document.getElementById('admin-app')){
	ReactDOM.render(
		<AdminApp />,
		document.getElementById('admin-app')
	)
}