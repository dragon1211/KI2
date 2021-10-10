import ReactDOM from 'react-dom';
import ChildApp from './child';

// ----------------------------------------------------------------------

if(document.getElementById('c-app')){
	ReactDOM.render(
		<ChildApp />,
		document.getElementById('c-app')
	)
}