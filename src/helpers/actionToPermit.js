const actionMap = new Map();
actionMap.set('post', 'create');
actionMap.set('get', 'read');
actionMap.set('put', 'update');
actionMap.set('patch', 'update');
actionMap.set('delete', 'delete');

export default (action) => actionMap.get(action);
