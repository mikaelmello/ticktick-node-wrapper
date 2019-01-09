const ObjectID = require('bson-objectid');
const conn = require('./connection');
const Task = require('./task');

function List(options) {
  this.id = ObjectID(options.id);
  this.name = options.name;
  this.isOwner = !(options.isOwner === false);
  this.color = options.color;
  this.closed = options.closed || false;
  this.muted = options.muted || false;
  this.groupId = options.groupId && ObjectID(options.id);
}

List.prototype._getAll = async function _getAll(/* filter */) {
  const options = {
    uri: `${conn.baseUri}/projects`,
    json: true,
  };

  const rawLists = await conn.request(options);
  return rawLists.map(list => new List(list));
};

List.prototype.addSimpleTask = async function _addSimpleTask(title, content) {
  const task = new Task({ title, content, listId: this.id });
  task._add();
};

module.exports = List;

// List structure from api response
// {
//   id: '5c342818e4b04a7154bfea3a',
//   name: 'Any',
//   isOwner: true,
//   color: null,
//   inAll: true,
//   sortOrder: 5634997092352,
//   sortType: 'sortOrder',
//   userCount: 1,
//   etag: 'nhkgjsie',
//   modifiedTime: '2019-01-08T14:04:43.161+0000',
//   closed: null,
//   muted: false,
//   groupId: '5c0eee2aedcd255b9cfde1c0',
// }
