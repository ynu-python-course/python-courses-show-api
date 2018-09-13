import {
  Router
} from 'express';
import fs from 'fs';
import path from 'path';

const routes = Router();

const courseRootDir = path.join(__dirname, '../public/courses/')
const webRoot = path.join(__dirname, '../public/')

// https://gist.github.com/kethinov/6658166

/**
 * return the data structure needed for https://github.com/phraniiac/react-ui-tree/
 * @param {*} dir
 * @param {*} parentNode
 * @return a object like this
  {
    "module": "courses",
    "collapsed": true,
    "children": [{
        "module": "Python-2018-春",
        "collapsed": true,
        "children": [{
            "module": "team1",
            "collapsed": true,
            "children": [{
                "module": "README.md",
                "leaf": true
            }, {
                "module": "src",
                "collapsed": true,
                "children": [{
                    "module": "hello.py",
                    "leaf": true
                }]
            }]
        }, {
            "module": "team2",
            "collapsed": true,
            "children": [{
                "module": "README.md",
                "leaf": true
            }, {
                "module": "src",
                "collapsed": true,
                "children": [{
                    "module": "hello.py",
                    "leaf": true
                }]
            }]
        }]
    }]
  }
 */
const walkDirForReactUiTree = function (dir, parentNode) {
  parentNode = parentNode || {
    module: path.basename(dir),
    collapsed: true,
    children: []
  };
  const files = fs.readdirSync(dir);
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      // if the file is directory
      const subParentNode = {
        module: file,
        collapsed: true,
        children: []
      };
      walkDirForReactUiTree(path.join(dir, file), subParentNode);
      parentNode['children'].push(subParentNode);
    } else {
      // if the file is file
      parentNode['children'].push({
        module: file,
        leaf: true
      });
    }
  });
  return parentNode;
};

/**
 *
 * return the data structure needed for https://github.com/frontend-collective/react-sortable-tree-theme-file-explorer
 * @param {*} dir
 * @param {*} parentNode
 * @return a object like this
  [
    {
        title: '.gitignore'
    },
    {
        title: 'package.json'
    },
    {
        title: 'src',
        isDirectory: true,
        expanded: true,
        children: [{
                title: 'styles.css'
            },
            {
                title: 'index.js'
            },
            {
                title: 'reducers.js'
            },
            {
                title: 'actions.js'
            },
            {
                title: 'utils.js'
            },
        ],
    },
    {
        title: 'tmp',
        isDirectory: true,
        children: [{
                title: '12214124-log'
            },
            {
                title: 'drag-disabled-file',
                dragDisabled: true
            },
        ],
    },
    {
        title: 'build',
        isDirectory: true,
        children: [{
            title: 'react-sortable-tree.js'
        }],
    },
    {
        title: 'public',
        isDirectory: true,
    },
    {
        title: 'node_modules',
        isDirectory: true,
    },
  ]
 */
const walkDirForReactSortableTree = function (dir, parentNode, level=0) {
  console.info(`level: ${level}, level < 2: ${level < 2}`);
  parentNode = parentNode || {
    title: path.basename(dir),
    expanded: level < 2,
    isDirectory: true,
    children: []
  };
  level ++;
  const files = fs.readdirSync(dir);
  files.forEach(function (file) {
    // ignore the dot prefix hidden files
    if (file.startsWith('.')) {
      return;
    }
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      // if the file is directory
      const subParentNode = {
        title: file,
        expanded: level < 2,
        isDirectory: true,
        children: []
      };
      walkDirForReactSortableTree(path.join(dir, file), subParentNode, level);
      parentNode['children'].push(subParentNode);
    } else {
      // if the file is file
      parentNode['children'].push({
        title: file,
        path: '/' + path.relative(webRoot, path.join(dir, file)).replace(/\\/g, '/')
      });
    }
  });
  return parentNode;
};

/**
 *
 * return the data structure needed for https://github.com/liudonghua123/react-nested-file-tree
 * @param {*} dir
 * @param {*} parentNode
 * @return a object like this
  {
    _contents: [
      {
        name: 'file_name1',
        path: 'file_name1'
      }
    ],
    folder_name1: {
      _contents: [
        {
          name: 'file_name2',
          path: 'folder_name1/file_name2'
        }
      ],
      folder_name2: {
        _contents: [
          {
            name: 'file_name3',
            path: 'folder_name1/folder_name2/file_name3'
          }
        ]
      }
    }
  }
 */
const walkDirForReactNestedFileTree = function (dir, parentNode) {
  parentNode = parentNode || {
    _contents: []
  };
  const files = fs.readdirSync(dir);
  files.forEach(function (file) {
    // ignore the dot prefix hidden files
    if (file.startsWith('.')) {
      return;
    }
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      // if the file is directory
      const subParentNode = {
        _contents: []
      };
      walkDirForReactNestedFileTree(path.join(dir, file), subParentNode);
      parentNode[path.basename(path.join(dir, file))] = subParentNode;
    } else {
      // if the file is file
      parentNode['_contents'].push({
        name: file,
        path: '/' + path.relative(webRoot, path.join(dir, file)).replace(/\\/g, '/')
      });
    }
  });
  return parentNode;
};



/**
 * GET directory travse data for specified type
 */
routes.get('/', (req, res) => {
  const {
    type
  } = req.query;
  let courseTree;
  switch (type) {
    case 'reactUiTree':
      courseTree = walkDirForReactUiTree(courseRootDir);
      break;
    case 'reactSortableTree':
      courseTree = [walkDirForReactSortableTree(courseRootDir)];
      break;
    default:
      courseTree = walkDirForReactNestedFileTree(courseRootDir);
      break;
  }
  res.json(courseTree);
});

export default routes;
