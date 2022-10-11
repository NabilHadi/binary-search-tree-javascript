class MyNode {
  constructor(value = null) {
    this.data = value;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array = []) {
    // Sort the Array
    array.sort((a, b) => a - b);

    // Remove Duplicates
    array = [...new Set(array)];
    this.root = this.buildTree(array);
  }

  // Assume array is sorted and no duplicates
  buildTree(array) {
    function sortArray(arr, start, end) {
      if (start > end) return null;

      const mid = Math.floor((start + end) / 2);
      const _rootNode = new MyNode(arr[mid]);

      _rootNode.left = sortArray(arr, start, mid - 1);
      _rootNode.right = sortArray(arr, mid + 1, end);

      return _rootNode;
    }

    return sortArray(array, 0, array.length - 1);
  }

  insert(value) {
    function insertRec(v, node) {
      if (!node) return;

      if (node.data > v) {
        if (node.left) {
          insertRec(v, node.left);
        } else {
          node.left = new MyNode(v);
        }
      } else if (node.data < v) {
        if (node.right) {
          insertRec(v, node.right);
        } else {
          node.right = new MyNode(v);
        }
      }
    }

    insertRec(value, this.root);
  }

  delete(value) {
    let inorder = this.inorder;
    function deleteRec(node, v) {
      if (!node) return;

      if (node.data > v) {
        if (!node.left) return;

        if (node.left.data != v) {
          deleteRec(node.left, v);
        } else {
          // ntd = node to delete
          let ntd = node.left;
          // if node has two children
          if (ntd.left && ntd.right) {
            let inorderArr = inorder(null, ntd.right);
            deleteRec(ntd.right, inorderArr[0]);
            ntd.data = inorderArr[0];
          } else if (ntd.left) {
            node.left = ntd.left;
          } else if (ntd.right) {
            node.left = ntd.right;
          } else {
            node.left = null;
          }
        }
      } else if (node.data < v) {
        if (!node.right) return;

        if (node.right.data != v) {
          deleteRec(node.right, v);
        } else {
          // ntd = node to delete
          let ntd = node.right;
          // if node has two children
          if (ntd.left && ntd.right) {
            let inorderArr = inorder(null, ntd.right);
            deleteRec(ntd.right, inorderArr[0]);
            ntd.data = inorderArr[0];
          } else if (ntd.left) {
            node.right = ntd.left;
          } else if (ntd.right) {
            node.right = ntd.right;
          } else {
            node.right = null;
          }
        }
      } else {
        let inorderArr = inorder(null, node.right);
        deleteRec(node.right, inorderArr[0]);
        node.data = inorderArr[0];
      }
    }

    deleteRec(this.root, value);
  }

  find(value) {
    function findRec(node, v) {
      if (!node) return;

      if (node.data === v) {
        return node;
      }

      if (node.data > v) {
        return findRec(node.left, v);
      }

      if (node.data < v) {
        return findRec(node.right, v);
      }
    }

    return findRec(this.root, value);
  }

  levelOrder(func) {
    let result = [];
    const queue = [];

    function levelOrderRec(node) {
      if (!node) return;

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);

      if (typeof func === "function") {
        func(node.data);
      } else {
        result.push(node.data);
      }

      levelOrderRec(queue.shift());
    }

    levelOrderRec(this.root);
    if (!func) {
      return result;
    }
  }

  preorder(func, root) {
    let result = [];
    function preorderRec(node) {
      if (!node) return;

      if (typeof func === "function") {
        func(node);
      } else {
        result.push(node.data);
      }

      if (node.left) preorderRec(node.left);
      if (node.right) preorderRec(node.right);
    }

    preorderRec(root ? root : this.root);
    if (!func) {
      return result;
    }
  }

  inorder(func, root) {
    let result = [];
    function inorderRec(node) {
      if (!node) return;

      if (node.left) inorderRec(node.left);
      if (typeof func === "function") {
        func(node);
      } else {
        result.push(node.data);
      }
      if (node.right) inorderRec(node.right);
    }

    inorderRec(root ? root : this.root);
    if (!func) {
      return result;
    }
  }

  postorder(func, root) {
    let result = [];
    function postorder(node) {
      if (!node) return;

      if (node.left) postorder(node.left);
      if (node.right) postorder(node.right);
      if (typeof func === "function") {
        func(node);
      } else {
        result.push(node.data);
      }
    }

    postorder(root ? root : this.root);
    if (!func) {
      return result;
    }
  }

  depth(node) {
    function depthRec(root, n) {
      if (!root) return 0;

      if (root.left === n || root.right === n) {
        return 1;
      } else {
        let leftDepth = depthRec(root.left, n);
        let rightDepth = depthRec(root.right, n);
        if (leftDepth !== 0) {
          return 1 + leftDepth;
        } else if (rightDepth !== 0) {
          return 1 + rightDepth;
        }
        return 0;
      }
    }

    return depthRec(this.root, node);
  }

  height(node) {
    if (!node) return 0;

    if (node.left || node.right) {
      let lh = this.height(node.left);
      let rh = this.height(node.right);
      return 1 + Math.max(lh, rh);
    }

    return 0;
  }

  isBalanced() {
    let leftHeight = this.height(this.root.left);
    let rightHeight = this.height(this.root.right);

    if (Math.abs(leftHeight - rightHeight) > 1) {
      return false;
    } else {
      return true;
    }
  }

  rebalance() {
    let sortedArr = this.inorder(null, this.root);
    this.root = this.buildTree(sortedArr);
    return this.root;
  }
}

const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

const unsortedArr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

function getRandomNumbersArray(length, max) {
  return Array.from({ length }, () => Math.floor(Math.random() * max));
}

function unBalanceTree(tree) {
  let randomNums = getRandomNumbersArray(5, 10000);
  randomNums.forEach((num) => {
    tree.insert(num);
  });
}

const tree = new Tree(getRandomNumbersArray(10, 1000));
prettyPrint(tree.root);
