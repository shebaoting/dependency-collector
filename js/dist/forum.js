/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t, o);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}


/***/ }),

/***/ "./src/common/index.ts":
/*!*****************************!*\
  !*** ./src/common/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/app */ "flarum/common/app");
/* harmony import */ var flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_app__WEBPACK_IMPORTED_MODULE_0__);

flarum_common_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('shebaoting/dependency-collector', function () {
  console.log('[shebaoting/dependency-collector] Hello, forum and admin!');
});

/***/ }),

/***/ "./src/common/models/DependencyItem.js":
/*!*********************************************!*\
  !*** ./src/common/models/DependencyItem.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DependencyItem)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/mixin */ "flarum/common/utils/mixin");
/* harmony import */ var flarum_common_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/string */ "flarum/common/utils/string");
/* harmony import */ var flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_3__);

// js/src/common/models/DependencyItem.js



var DependencyItem = /*#__PURE__*/function (_Model) {
  function DependencyItem() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    _this.title = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('title');
    _this.link = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('link');
    _this.description = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('description');
    _this.status = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('status');
    // 确保 status 属性存在
    _this.submittedAt = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('submittedAt', (flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().transformDate));
    _this.approvedAt = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('approvedAt', (flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().transformDate));
    _this.user = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasOne('user');
    _this.approver = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasOne('approver');
    _this.tags = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().hasMany('tags');
    _this.canEdit = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canEdit');
    // 确保 canEdit 属性存在
    _this.canApprove = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canApprove');
    // 确保 canApprove 属性存在
    _this.canDelete = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canDelete');
    // 确保存储从后端接收的 canDelete 权限
    _this.isFavorited = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('isFavorited');
    _this.canFavorite = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canFavorite');
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DependencyItem, _Model);
  var _proto = DependencyItem.prototype;
  _proto.shortDescription = function shortDescription(length) {
    if (length === void 0) {
      length = 100;
    }
    var desc = this.description();
    if (!desc) return '';
    return (0,flarum_common_utils_string__WEBPACK_IMPORTED_MODULE_3__.getPlainContent)(desc).substring(0, length) + (desc.length > length ? '...' : '');
  };
  return DependencyItem;
}((flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/common/models/DependencyTag.js":
/*!********************************************!*\
  !*** ./src/common/models/DependencyTag.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DependencyTag)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__);


var DependencyTag = /*#__PURE__*/function (_Model) {
  function DependencyTag() {
    var _this;
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _Model.call.apply(_Model, [this].concat(args)) || this;
    _this.name = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('name');
    _this.slug = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('slug');
    _this.description = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('description');
    _this.color = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('color');
    _this.icon = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('icon');
    _this.createdAt = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('createdAt', (flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().transformDate));
    _this.updatedAt = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('updatedAt', (flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().transformDate));
    _this.itemCount = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('itemCount');
    _this.canEdit = flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default().attribute('canEdit');
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DependencyTag, _Model);
  return DependencyTag;
}((flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/DependencyItemCard.js":
/*!****************************************************!*\
  !*** ./src/forum/components/DependencyItemCard.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DependencyItemCard)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/helpers/avatar */ "flarum/common/helpers/avatar");
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/helpers/username */ "flarum/common/helpers/username");
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/humanTime */ "flarum/common/utils/humanTime");
/* harmony import */ var flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _EditDependencyModal__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./EditDependencyModal */ "./src/forum/components/EditDependencyModal.js");

// js/src/forum/components/DependencyItemCard.js








var DependencyItemCard = /*#__PURE__*/function (_Component) {
  function DependencyItemCard() {
    return _Component.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DependencyItemCard, _Component);
  var _proto = DependencyItemCard.prototype;
  _proto.view = function view() {
    var _item$user,
      _this = this;
    var item = this.attrs.item;
    var user = item.user();
    return m("div", {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default()('DependencyItemCard', item.status() === 'pending' && 'DependencyItemCard--pending')
    }, item.status() === 'pending' && app.session.user && (app.session.user.id() === ((_item$user = item.user()) == null ? void 0 : _item$user.id()) || item.canApprove()) && m("span", {
      className: "DependencyItemCard-statusBadge"
    }, app.translator.trans('shebaoting-dependency-collector.forum.item.pending_approval')), m("div", {
      className: "DependencyItemCard-header"
    }, m("h3", {
      className: "DependencyItemCard-title"
    }, m("a", {
      href: item.link(),
      target: "_blank",
      rel: "noopener noreferrer"
    }, item.title()))), m("div", {
      className: "DependencyItemCard-body"
    }, m("p", {
      className: "DependencyItemCard-description"
    }, item.shortDescription(150))), m("div", {
      className: "DependencyItemCard-footer"
    }, m("div", {
      className: "DependencyItemCard-tags"
    }, item.tags() && item.tags().map(function (tag) {
      return m((flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_2___default()), {
        key: tag.id(),
        className: "DependencyItemCard-tag",
        href: app.route('dependency-collector.forum.index', {
          tagSlug: tag.slug()
        }),
        style: {
          backgroundColor: tag.color(),
          color: _this.getTextColorForBackground(tag.color())
        }
      }, tag.icon() && m("i", {
        className: tag.icon() + ' DependencyItemCard-tagIcon'
      }), tag.name());
    })), m("div", {
      className: "DependencyItemCard-meta"
    }, user && m("span", {
      className: "DependencyItemCard-submitter"
    }, flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3___default()(user, {
      className: 'DependencyItemCard-avatar'
    }), flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4___default()(user)), m("span", {
      className: "DependencyItemCard-time",
      title: item.submittedAt().toLocaleString()
    }, flarum_common_utils_humanTime__WEBPACK_IMPORTED_MODULE_5___default()(item.submittedAt())), m("div", {
      className: "DependencyItemCard-actions"
    }, item.canEdit() && m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
      className: "Button Button--icon Button--link",
      icon: "fas fa-pencil-alt",
      onclick: this.editItem.bind(this),
      "aria-label": app.translator.trans('core.forum.post_controls.edit_button')
    }), item.canApprove() && m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default()('Button Button--icon Button--link', item.status() === 'approved' ? 'Button--danger' : 'Button--success'),
      icon: item.status() === 'approved' ? 'fas fa-times' : 'fas fa-check',
      onclick: this.toggleApproval.bind(this),
      "aria-label": item.status() === 'approved' ? app.translator.trans('shebaoting-dependency-collector.forum.item.unapprove_button') : app.translator.trans('shebaoting-dependency-collector.forum.item.approve_button')
    }), item.canDelete() && m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
      className: "Button Button--icon Button--link Button--danger" // 使用危险样式
      ,
      icon: "fas fa-trash-alt" // 删除图标
      ,
      onclick: this.deleteItem.bind(this) // 绑定删除方法
      ,
      "aria-label": app.translator.trans('shebaoting-dependency-collector.forum.item.delete_button_label') // Aria 标签
    }), app.session.user && item.canFavorite() &&
    // 仅登录用户且有权限时显示
    m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_7___default()), {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_6___default()('Button Button--icon Button--link', item.isFavorited() && 'Button--favorited') // 可以添加一个 .Button--favorited 类来改变样式
      ,
      icon: item.isFavorited() ? 'fas fa-star' : 'far fa-star' // 实心/空心星星
      ,
      onclick: this.toggleFavorite.bind(this),
      "aria-label": item.isFavorited() ? app.translator.trans('shebaoting-dependency-collector.forum.item.unfavorite_button_label') // 需要添加翻译
      : app.translator.trans('shebaoting-dependency-collector.forum.item.favorite_button_label') // 需要添加翻译
    })))));
  };
  _proto.editItem = function editItem() {
    // 编辑逻辑保持不变
    app.modal.show(_EditDependencyModal__WEBPACK_IMPORTED_MODULE_8__["default"], {
      item: this.attrs.item,
      onsave: this.attrs.onchange
    });
  };
  _proto.toggleApproval = function toggleApproval() {
    var _this2 = this;
    // 批准/取消批准逻辑保持不变
    var item = this.attrs.item;
    var newStatus = item.status() === 'approved' ? 'pending' : 'approved';
    item.save({
      status: newStatus
    }).then(function () {
      if (_this2.attrs.onchange) _this2.attrs.onchange();
      m.redraw();
    })["catch"](function (error) {
      console.error('Error toggling approval status:', error);
    });
  };
  _proto.deleteItem = function deleteItem() {
    var _this3 = this;
    var item = this.attrs.item;

    // --- 修改: 使用原生 confirm 替代 Flarum Modal ---
    // 显示原生 JavaScript 确认对话框
    var confirmed = window.confirm(
    // 从 locale 文件获取确认文本
    app.translator.trans('shebaoting-dependency-collector.forum.item.delete_confirmation_text'));

    // 只有当用户点击 "确定" 时 (confirmed 为 true)，才执行删除操作
    if (confirmed) {
      // 显示加载状态或禁用按钮可以在这里添加，但对于原生 confirm 比较困难，暂时省略
      // this.loading = true; // 如果有加载状态管理
      // m.redraw();

      item["delete"]().then(function () {
        // 如果父组件提供了 onchange 回调 (例如列表页刷新), 调用它
        if (_this3.attrs.onchange) {
          _this3.attrs.onchange();
        }
        // 通常删除后需要重绘界面
        // 注意：如果 onchange 已经触发了列表页的重载，这里的 redraw 可能不需要
        // 但保留通常是安全的
        m.redraw();
      })["catch"](function (error) {
        console.error('Error deleting item:', error);
        // 显示错误提示
        app.alerts.show({
          type: 'error'
        }, app.translator.trans('core.lib.error.generic_message'));
      })["finally"](function () {
        // 结束加载状态（如果添加了）
        // this.loading = false;
        // m.redraw();
      });
    }
    // --- 修改结束 ---
  };
  _proto.getTextColorForBackground = function getTextColorForBackground(hexColor) {
    // 此方法保持不变
    if (!hexColor) return 'white';
    hexColor = hexColor.replace('#', '');
    if (hexColor.length === 3) {
      hexColor = hexColor[0].repeat(2) + hexColor[1].repeat(2) + hexColor[2].repeat(2);
    }
    if (hexColor.length !== 6) {
      return 'white'; // Fallback for invalid color
    }
    var r = parseInt(hexColor.substr(0, 2), 16);
    var g = parseInt(hexColor.substr(2, 2), 16);
    var b = parseInt(hexColor.substr(4, 2), 16);
    var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };
  _proto.toggleFavorite = function toggleFavorite() {
    var _this4 = this;
    var item = this.attrs.item;
    var wasFavorited = item.isFavorited();

    // 乐观更新UI
    item.pushData({
      attributes: {
        isFavorited: !wasFavorited
      }
      // 如果API返回完整的item，relationships 可能不需要在这里更新
    });
    m.redraw(); // 可能不需要，因为 save 也会触发重绘

    // 发起 API 请求
    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + "/dependency-items/" + item.id() + "/favorite"
    }).then(function (response) {
      // API 应该返回更新后的 item，store 会自动处理
      app.store.pushPayload(response);
      // 如果父组件有 onchange，可以调用
      if (_this4.attrs.onchange) {
        _this4.attrs.onchange();
      }
    })["catch"](function (error) {
      // API 请求失败，回滚乐观更新
      item.pushData({
        attributes: {
          isFavorited: wasFavorited
        }
      });
      m.redraw();
      // 显示错误提示
      app.alerts.show({
        type: 'error'
      }, app.translator.trans('core.lib.error.generic_message'));
      throw error; // 重新抛出错误，以便上层可以捕获（如果需要）
    });
  };
  return DependencyItemCard;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/DependencyListPage.js":
/*!****************************************************!*\
  !*** ./src/forum/components/DependencyListPage.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DependencyListPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Page */ "flarum/common/components/Page");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _DependencyItemCard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DependencyItemCard */ "./src/forum/components/DependencyItemCard.js");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _SubmitDependencyModal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./SubmitDependencyModal */ "./src/forum/components/SubmitDependencyModal.js");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_8__);

// js/src/forum/components/DependencyListPage.js





// Link 导入是好的实践，即使当前没有直接使用实例



 // 用于动态添加类
var DependencyListPage = /*#__PURE__*/function (_Page) {
  function DependencyListPage() {
    return _Page.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DependencyListPage, _Page);
  var _proto = DependencyListPage.prototype;
  _proto.oninit = function oninit(vnode) {
    _Page.prototype.oninit.call(this, vnode);
    console.log('DependencyListPage oninit'); // 调试日志

    this.loadingItems = true; // 依赖项列表的加载状态
    this.loadingMore = false; // “加载更多”按钮的加载状态
    this.items = [];
    this.tags = app.store.all('dependency-tags') || []; // 先尝试从 store 中获取
    this.moreResults = false;
    this.currentTagFilter = m.route.param('tagSlug') || null;
    this.showingFavorites = m.route.param('filter') === 'favorites';

    // --- 修改: 仅当 store 中没有标签时才加载 ---
    if (this.tags.length === 0) {
      this.loadingTags = true; // 只有在需要从API加载时才设置为true
      this.loadTags();
    } else {
      this.loadingTags = false; // 如果store中有，则不需要加载状态
      console.log('Tags already in store, not loading from API initially.');
    }
    // --- 修改结束 ---

    this.loadResults(0); // 加载第一页依赖项
  };
  _proto.oncreate = function oncreate(vnode) {
    _Page.prototype.oncreate.call(this, vnode);
    app.setTitle(app.translator.trans('shebaoting-dependency-collector.forum.nav_title'));
    app.setTitleCount(0);
  };
  _proto.onbeforeupdate = function onbeforeupdate(vnode, old) {
    _Page.prototype.onbeforeupdate.call(this, vnode, old);
    var newTagFilter = m.route.param('tagSlug') || null;
    var newShowingFavorites = m.route.param('filter') === 'favorites';
    if (newTagFilter !== this.currentTagFilter || newShowingFavorites !== this.showingFavorites) {
      this.currentTagFilter = newTagFilter;
      this.showingFavorites = newShowingFavorites;
      this.loadResults(0);
      return false;
    }
    return true;
  };
  _proto.view = function view() {
    var _app$forum,
      _this = this,
      _app$forum2;
    console.log('DependencyListPage view rendering. LoadingItems:', this.loadingItems, 'LoadingTags:', this.loadingTags, 'Items:', this.items.length, 'Tags:', this.tags.length, 'CurrentTag:', this.currentTagFilter);
    return m("div", {
      className: "container"
    }, m("div", {
      className: "sideNavContainer IndexPage-main"
    }, m("div", {
      className: "IndexPage-nav sideNav dependencylist-sidenav"
    }, m("ul", {
      className: "DependencyListPage"
    }, m("li", {
      className: "item-newDiscussion App-primaryControl"
    }, app.session.user && ((_app$forum = app.forum) == null ? void 0 : _app$forum.attribute('canSubmitDependencyCollectorItem')) && m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button Button--primary IndexPage-newDiscussion",
      icon: "fas fa-plus",
      onclick: function onclick() {
        return app.modal.show(_SubmitDependencyModal__WEBPACK_IMPORTED_MODULE_6__["default"], {
          onsubmit: function onsubmit() {
            return _this.loadResults(0);
          }
        });
      }
    }, app.translator.trans('shebaoting-dependency-collector.forum.list.submit_button')), app.session.user && ((_app$forum2 = app.forum) == null ? void 0 : _app$forum2.attribute('canFavoriteDependencyCollectorItemGlobal')) && m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_8___default()('Button IndexPage-newDiscussion favorites', this.showingFavorites && 'active'),
      icon: "fas fa-star",
      onclick: this.showMyFavorites.bind(this)
    }, app.translator.trans('shebaoting-dependency-collector.forum.list.my_favorites_button'))), m("li", {
      className: "item-nav DependencyListPage-sidebar"
    }, m("div", {
      className: "ButtonGroup Dropdown dropdown App-titleControl Dropdown--select itemCount9"
    }, this.loadingTags && !this.tags.length ?
    // 只有在加载中且tags为空时显示
    m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default()), null) : m("ul", {
      className: "DependencyListTags"
    }, m("li", {
      className: 'TagLink ' + (!this.currentTagFilter && !this.showingFavorites ? 'active item-allDiscussions' : 'item-allDiscussions')
    }, m("a", {
      href: app.route('dependency-collector.forum.index'),
      onclick: function onclick(e) {
        e.preventDefault();
        if (_this.currentTagFilter || _this.showingFavorites) {
          m.route.set(app.route('dependency-collector.forum.index'));
        }
      }
    }, m("span", {
      className: "TagLink-name"
    }, app.translator.trans('shebaoting-dependency-collector.forum.list.all_tags')))), this.tags && this.tags.length > 0 ? this.tags.map(function (tag) {
      return m("li", {
        key: tag.id(),
        className: 'TagLink ' + (_this.currentTagFilter === tag.slug() && !_this.showingFavorites ? 'active item-allDiscussions' : 'item-allDiscussions')
      }, m("a", {
        href: app.route('dependency-collector.forum.index', {
          tagSlug: tag.slug()
        }),
        onclick: function onclick(e) {
          e.preventDefault();
          if (_this.currentTagFilter !== tag.slug() || _this.showingFavorites) {
            m.route.set(app.route('dependency-collector.forum.index', {
              tagSlug: tag.slug()
            }));
          }
        }
      }, tag.icon() && m("i", {
        className: tag.icon() + ' TagLink-icon'
      }), m("span", {
        className: "TagLink-name"
      }, tag.name())));
    }) : !this.loadingTags &&
    // 如果不是加载中且没有标签
    m("li", {
      className: "TagLink disabled"
    }, m("span", {
      className: "TagLink-name"
    }, app.translator.trans('shebaoting-dependency-collector.forum.list.no_tags')))))))), m("div", {
      className: "IndexPage-results sideNavOffset DependencyListPage"
    }, m("div", {
      className: "DependencyListPage-body"
    }, this.loadingItems && this.items.length === 0 ? m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default()), null) : m("div", {
      className: "DependencyList"
    }, this.items && this.items.length > 0 ? this.items.map(function (item) {
      return m(_DependencyItemCard__WEBPACK_IMPORTED_MODULE_4__["default"], {
        item: item,
        key: item.id(),
        onchange: function onchange() {
          return _this.loadResults(0);
        }
      });
    }) : !this.loadingItems && m("p", null, app.translator.trans('shebaoting-dependency-collector.forum.list.empty_text'))), this.moreResults && m("div", {
      style: "text-align: center; margin-top: 10px;"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button",
      onclick: this.loadMore.bind(this),
      loading: this.loadingMore
    }, app.translator.trans('core.forum.discussion_list.load_more_button')))))));
  };
  _proto.loadResults = function loadResults(offset) {
    var _this2 = this;
    if (offset === void 0) {
      offset = 0;
    }
    if (offset === 0) {
      this.loadingItems = true;
      this.items = [];
      this.moreResults = false;
      m.redraw();
    } else {
      this.loadingMore = true;
      m.redraw();
    }
    var params = {
      page: {
        offset: offset
      },
      sort: '-approvedAt',
      include: 'user,tags,approver,favoritedByUsers',
      filter: {}
    };
    if (this.showingFavorites) {
      params.filter.isFavorite = true;
    } else if (this.currentTagFilter) {
      params.filter.tag = this.currentTagFilter;
    }
    console.log('Loading results with params:', JSON.stringify(params));
    return app.store.find('dependency-items', params).then(function (results) {
      console.log('Results loaded:', results);
      if (Array.isArray(results)) {
        var _results$payload;
        if (offset === 0) {
          _this2.items = results;
        } else {
          var _this2$items;
          (_this2$items = _this2.items).push.apply(_this2$items, results);
        }
        _this2.moreResults = !!((_results$payload = results.payload) != null && (_results$payload = _results$payload.links) != null && _results$payload.next);
        console.log('More results:', _this2.moreResults);
      } else {
        console.error('API did not return an array for dependency-items:', results);
        if (offset === 0) _this2.items = [];
        _this2.moreResults = false;
      }
    })["catch"](function (error) {
      console.error('Error loading dependency items:', error);
      if (offset === 0) _this2.items = [];
      _this2.moreResults = false;
      app.alerts.show({
        type: 'error'
      }, app.translator.trans('shebaoting-dependency-collector.forum.list.load_error'));
    })["finally"](function () {
      _this2.loadingItems = false;
      _this2.loadingMore = false;
      m.redraw();
      console.log('Loading finished, redraw called.');
    });
  };
  _proto.loadTags = function loadTags() {
    var _this3 = this;
    console.log('Attempting to load tags from API because store is empty.'); // 调试日志
    this.loadingTags = true;
    m.redraw(); // 确保加载状态立即反映

    app.store.find('dependency-tags', {
      sort: 'name'
    }).then(function (tags) {
      console.log('Tags loaded from API:', tags);
      // store 会自动更新 app.store.all('dependency-tags')
      // 所以我们只需要更新组件内的 this.tags 即可
      _this3.tags = app.store.all('dependency-tags');
      if (!Array.isArray(_this3.tags)) {
        // 双重检查，以防 store 返回非数组
        console.error('app.store.all("dependency-tags") did not return an array after find:', _this3.tags);
        _this3.tags = [];
      }
    })["catch"](function (error) {
      console.error('Error loading tags:', error);
      _this3.tags = []; // 出错时也保证 this.tags 是空数组
      app.alerts.show({
        type: 'error'
      }, app.translator.trans('shebaoting-dependency-collector.forum.list.load_tags_error'));
    })["finally"](function () {
      _this3.loadingTags = false;
      // 再次从 store 获取，确保拿到最新的数据
      var storeTags = app.store.all('dependency-tags');
      _this3.tags = Array.isArray(storeTags) ? storeTags : [];
      m.redraw();
      console.log('Tag loading finished. Tags in component state:', _this3.tags);
    });
  };
  _proto.loadMore = function loadMore() {
    if (this.loadingItems || this.loadingMore) return;
    console.log('Loading more items...');
    this.loadResults(this.items.length);
  };
  _proto.onremove = function onremove(vnode) {
    console.log('DependencyListPage onremove');
    _Page.prototype.onremove.call(this, vnode);
  };
  _proto.showMyFavorites = function showMyFavorites() {
    // --- 修改: 当点击 "My Favorites" 时，如果当前不是 "My Favorites"，则切换路由 ---
    // 同时也应该确保，如果当前是某个标签的筛选，也切换到 "My Favorites"
    if (!this.showingFavorites) {
      m.route.set(app.route('dependency-collector.forum.index', {
        filter: 'favorites'
      }));
    } else if (this.showingFavorites && this.currentTagFilter) {
      // 如果当前是收藏夹但同时有标签过滤 (虽然你的UI可能不允许，但逻辑上可以处理)
      // 这种情况下，可能希望清除标签过滤，只看收藏夹
      m.route.set(app.route('dependency-collector.forum.index', {
        filter: 'favorites'
      }));
    }
    // --- 修改结束 ---
  };
  return DependencyListPage;
}((flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/EditDependencyModal.js":
/*!*****************************************************!*\
  !*** ./src/forum/components/EditDependencyModal.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditDependencyModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5__);

// js/src/forum/components/EditDependencyModal.js






var EditDependencyModal = /*#__PURE__*/function (_Modal) {
  function EditDependencyModal() {
    return _Modal.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(EditDependencyModal, _Modal);
  var _proto = EditDependencyModal.prototype;
  _proto.oninit = function oninit(vnode) {
    _Modal.prototype.oninit.call(this, vnode);
    this.item = this.attrs.item; // 获取要编辑的 item

    this.title = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.item.title());
    this.link = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.item.link());
    this.description = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.item.description());
    // 初始化选中的标签 ID 列表
    this.selectedTagIds = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.item.tags() ? this.item.tags().map(function (tag) {
      return tag.id();
    }) : []);
    this.availableTagsList = [];
    this.loadingTags = true;
    this.loadAvailableTags();
    this.alertAttrs = null; // 用于显示错误
  };
  _proto.className = function className() {
    return 'EditDependencyModal Modal--small'; // 可以给编辑弹窗不同的类名
  };
  _proto.title = function title() {
    // 可以为编辑弹窗设置一个不同的标题
    return app.translator.trans('shebaoting-dependency-collector.forum.modal.edit_title', {
      title: this.item.title()
    }); // 需要添加翻译
  };
  _proto.content = function content() {
    var _this = this;
    return m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "Form Form--centered"
    }, m("div", {
      className: "Form-group"
    }, m("input", {
      className: "FormControl",
      bidi: this.title
    })), m("div", {
      className: "Form-group"
    }, m("input", {
      type: "url",
      className: "FormControl",
      bidi: this.link
    })), m("div", {
      className: "Form-group"
    }, m("textarea", {
      className: "FormControl",
      bidi: this.description,
      rows: "5"
    })), m("div", {
      className: "Form-group"
    }, this.loadingTags ? m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_5___default()), null) : m("div", {
      className: "TagSelector"
    }, this.availableTagsList.length > 0 ? this.availableTagsList.map(function (tag) {
      var isSelected = _this.selectedTagIds().includes(tag.id());
      return m("span", {
        key: tag.id() // 添加 key
        ,
        className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default()('colored text-contrast--dark', isSelected && 'active'),
        icon: tag.icon(),
        style: isSelected ? {
          backgroundColor: tag.color(),
          borderColor: tag.color() || '#ddd',
          color: 'white' || 0
        } : {
          backgroundColor: '#d1f0da' || 0,
          color: '#669974'
        },
        onclick: function onclick() {
          return _this.toggleTag(tag.id());
        }
      }, tag.name());
    }) : m("p", null)), m("small", null, app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_help'))), m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      type: "submit",
      className: "Button Button--primary Button--block",
      loading: this.loading,
      disabled: !this.isDirty() || !this.isValid()
    }, app.translator.trans('shebaoting-dependency-collector.forum.modal.save_changes_button')))));
  };
  _proto.loadAvailableTags = function loadAvailableTags() {
    var _this2 = this;
    app.store.find('dependency-tags').then(function (tags) {
      _this2.availableTagsList = tags;
      _this2.loadingTags = false;
      m.redraw();
    })["catch"](function (error) {
      console.error('Error loading tags for edit modal:', error);
      _this2.loadingTags = false;
      m.redraw();
    });
  };
  _proto.toggleTag = function toggleTag(tagId) {
    var currentSelected = [].concat(this.selectedTagIds());
    var index = currentSelected.indexOf(tagId);
    if (index > -1) {
      currentSelected.splice(index, 1);
    } else {
      currentSelected.push(tagId);
    }
    this.selectedTagIds(currentSelected);
  }

  // 检查表单是否有效（例如，标签不能为空）
  ;
  _proto.isValid = function isValid() {
    var selectedTags = this.selectedTagIds();
    return this.title() && this.link() && this.description() && Array.isArray(selectedTags) && selectedTags.length > 0;
  }

  // 检查是否有任何更改
  ;
  _proto.isDirty = function isDirty() {
    var currentTagIds = this.item.tags() ? this.item.tags().map(function (tag) {
      return tag.id();
    }) : [];
    var selectedTagIds = this.selectedTagIds();
    // 比较数组需要排序
    var tagsChanged = JSON.stringify([].concat(currentTagIds).sort()) !== JSON.stringify([].concat(selectedTagIds).sort());
    return this.title() !== this.item.title() || this.link() !== this.item.link() || this.description() !== this.item.description() || tagsChanged;
  };
  _proto.onsubmit = function onsubmit(e) {
    var _this3 = this;
    e.preventDefault();
    if (!this.isDirty()) {
      this.hide(); // 如果没有更改，直接关闭
      return;
    }
    this.loading = true;
    this.alertAttrs = null; // 清除之前的错误

    var relationships = {
      tags: this.selectedTagIds().map(function (id) {
        return app.store.getById('dependency-tags', id);
      }).filter(function (tag) {
        return tag;
      })
    };
    this.item.save({
      title: this.title(),
      link: this.link(),
      description: this.description(),
      relationships: relationships
    }).then(function () {
      if (_this3.attrs.onsave) _this3.attrs.onsave(); // 如果父组件提供了回调
      _this3.hide(); // 保存成功后关闭
    })["catch"](function (error) {
      console.error('Error updating dependency:', error);
      _this3.alertAttrs = error.alert; // 显示 API 返回的错误
    })["finally"](function () {
      _this3.loading = false;
      m.redraw();
    });
  };
  return EditDependencyModal;
}((flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/SubmitDependencyModal.js":
/*!*******************************************************!*\
  !*** ./src/forum/components/SubmitDependencyModal.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SubmitDependencyModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/classList */ "flarum/common/utils/classList");
/* harmony import */ var flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4__);




// Select 组件不再需要
// import Select from 'flarum/common/components/Select';
 // 用于动态添加 CSS 类
var SubmitDependencyModal = /*#__PURE__*/function (_Modal) {
  function SubmitDependencyModal() {
    return _Modal.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SubmitDependencyModal, _Modal);
  var _proto = SubmitDependencyModal.prototype;
  _proto.oninit = function oninit(vnode) {
    var _this = this;
    _Modal.prototype.oninit.call(this, vnode);
    this.title = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()('');
    this.link = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()('');
    this.description = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()('');
    this.selectedTagIds = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()([]); // 仍然存储选中标签的 ID 数组

    this.availableTagsList = []; // 修改：存储标签对象的数组
    this.loadingTags = true;
    app.store.find('dependency-tags').then(function (tags) {
      // 修改：直接存储标签对象数组
      _this.availableTagsList = Array.isArray(tags) ? tags : [];
      _this.loadingTags = false;
      m.redraw();
    })["catch"](function (error) {
      console.error('Error loading tags for submit modal:', error);
      _this.loadingTags = false;
      m.redraw();
    });
  };
  _proto.className = function className() {
    return 'SubmitDependencyModal Modal--small';
  };
  _proto.title = function title() {
    return app.translator.trans('shebaoting-dependency-collector.forum.modal.submit_title');
  };
  _proto.content = function content() {
    var _this2 = this;
    return m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "Form Form--centered"
    }, m("div", {
      className: "Form-group"
    }, m("input", {
      className: "FormControl",
      bidi: this.title,
      placeholder: app.translator.trans('shebaoting-dependency-collector.forum.modal.title_placeholder')
    })), m("div", {
      className: "Form-group"
    }, m("input", {
      type: "url",
      className: "FormControl",
      bidi: this.link,
      placeholder: "https://example.com"
    })), m("div", {
      className: "Form-group"
    }, m("textarea", {
      className: "FormControl",
      bidi: this.description,
      rows: "5",
      placeholder: app.translator.trans('shebaoting-dependency-collector.forum.modal.description_placeholder')
    })), m("div", {
      className: "Form-group"
    }, this.loadingTags ? m("p", null, app.translator.trans('core.lib.loading_indicator_text')) :
    // --- 修改开始: 渲染平铺的标签 ---
    m("div", {
      className: "TagSelector"
    }, this.availableTagsList.length > 0 ? this.availableTagsList.map(function (tag) {
      var isSelected = _this2.selectedTagIds().includes(tag.id());
      return m("span", {
        className: flarum_common_utils_classList__WEBPACK_IMPORTED_MODULE_4___default()('colored text-contrast--dark', isSelected && 'active'),
        icon: tag.icon(),
        style: isSelected ? {
          backgroundColor: tag.color(),
          borderColor: tag.color() || '#ddd',
          color: 'white' || 0
        } : {
          backgroundColor: '#d1f0da' || 0,
          color: '#669974'
        },
        onclick: function onclick() {
          return _this2.toggleTag(tag.id());
        }
      }, tag.name());
    }) : m("p", null, app.translator.trans('shebaoting-dependency-collector.forum.modal.no_tags_available')) // 新增一个翻译条目
    )
    // --- 修改结束 ---
    , m("small", null, app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_help'))), m("div", {
      className: "Form-group"
    }, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      type: "submit",
      className: "Button Button--primary Button--block",
      loading: this.loading,
      disabled: !this.isValid()
    }, app.translator.trans('shebaoting-dependency-collector.forum.modal.submit_button')))));
  }

  // --- 新增方法：切换标签选中状态 ---
  ;
  _proto.toggleTag = function toggleTag(tagId) {
    var currentSelected = [].concat(this.selectedTagIds()); // 创建副本以避免直接修改 Stream 的内部数组
    var index = currentSelected.indexOf(tagId);
    if (index > -1) {
      currentSelected.splice(index, 1); // 如果已选中，则移除
    } else {
      currentSelected.push(tagId); // 如果未选中，则添加
    }
    this.selectedTagIds(currentSelected);
  }
  // --- 新增方法结束 ---
  ;
  _proto.isValid = function isValid() {
    var selectedTags = this.selectedTagIds();
    return this.title() && this.link() && this.description() && Array.isArray(selectedTags) && selectedTags.length > 0;
  };
  _proto.onsubmit = function onsubmit(e) {
    var _this3 = this;
    e.preventDefault();
    this.loading = true;
    var currentSelectedTagIds = this.selectedTagIds() || [];
    if (!Array.isArray(currentSelectedTagIds)) {
      console.error('SubmitDependencyModal onsubmit: currentSelectedTagIds is NOT an array before map. Halting submission logic.');
      this.loading = false;
      m.redraw();
      return;
    }
    var relationships = {
      tags: currentSelectedTagIds.map(function (id) {
        var tag = app.store.getById('dependency-tags', id);
        if (!tag) {
          console.warn("Tag with ID " + id + " not found in store.");
        }
        return tag;
      }).filter(function (tag) {
        return tag;
      })
    };
    app.store.createRecord('dependency-items').save({
      title: this.title(),
      link: this.link(),
      description: this.description(),
      relationships: relationships
    }).then(function () {
      if (_this3.attrs.onsubmit) _this3.attrs.onsubmit();
      _this3.hide();
    })["catch"](function (error) {
      console.error('Error submitting dependency:', error);
      _this3.alertAttrs = error.alert;
    })["finally"](function () {
      _this3.loading = false;
      m.redraw();
    });
  };
  return SubmitDependencyModal;
}((flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/index.ts":
/*!****************************!*\
  !*** ./src/forum/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/app */ "flarum/forum/app");
/* harmony import */ var flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _common_models_DependencyItem__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/models/DependencyItem */ "./src/common/models/DependencyItem.js");
/* harmony import */ var _common_models_DependencyTag__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/models/DependencyTag */ "./src/common/models/DependencyTag.js");
/* harmony import */ var _components_DependencyListPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/DependencyListPage */ "./src/forum/components/DependencyListPage.js");








// 确保 app 对象在全局可用 (Flarum 通常会处理这个)
// declare global {
//   const app: any;
// }

flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('shebaoting/dependency-collector', function () {
  console.log('[shebaoting/dependency-collector] Initializing forum extension.');

  // 1. 注册前端模型
  // 'dependency-items' 必须与 DependencyItemSerializer.php 中定义的 $type 匹配
  (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store).models['dependency-items'] = _common_models_DependencyItem__WEBPACK_IMPORTED_MODULE_4__["default"];
  // 'dependency-tags' 必须与 DependencyTagSerializer.php 中定义的 $type 匹配
  (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().store).models['dependency-tags'] = _common_models_DependencyTag__WEBPACK_IMPORTED_MODULE_5__["default"];

  // 2. 注册前端路由
  // 'dependency-collector.forum.index' 是你在后端 extend.php 中为前端路由定义的名称
  // '/dependencies' 是该路由的路径
  (flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().routes)['dependency-collector.forum.index'] = {
    path: '/dependencies',
    component: _components_DependencyListPage__WEBPACK_IMPORTED_MODULE_6__["default"]
  };

  // 3. 在论坛侧边栏添加导航链接
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'navItems', function (items) {
    items.add('dependency-collector',
    // 唯一的 key
    flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_3___default().component({
      href: flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().route('dependency-collector.forum.index'),
      icon: 'fas fa-cubes'
    }, flarum_forum_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('shebaoting-dependency-collector.forum.nav_title')), 85 // 调整优先级
    );
  });
  // 4. (可选但推荐) 将后端权限暴露给前端
  // 这个值应该通过 ForumSerializer 在后端添加到 app.forum.attributes 中
  // 在 extend.php 中:
  // (new Extend\ApiSerializer(Flarum\Api\Serializer\ForumSerializer::class))
  //     ->attribute('canSubmitDependencyCollectorItem', function ($serializer) {
  //         return $serializer->getActor()->hasPermission('dependency-collector.submit');
  //     }),
  //
  // 如果你已经在后端这样做了，那么下面的代码就不再需要了，
  // 你可以直接在你的组件中使用 app.forum.attribute('canSubmitDependencyCollectorItem')
  //
  // 为了演示，如果你想强制前端知道这个属性（即使后端没发送），可以这样做，但不推荐用于实际权限检查：
  // if (app.forum) { // 确保 app.forum 对象存在
  //   app.forum.data.attributes.canSubmitDependencyCollectorItem = true; // 示例：假设所有用户都能提交
  // }
  // 正确的做法是依赖后端通过 ForumSerializer 发送的 'canSubmitDependencyCollectorItem' 属性。
  // 在你的组件中，你应该检查 app.forum.attribute('canSubmitDependencyCollectorItem')
});

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/app":
/*!***************************************************!*\
  !*** external "flarum.core.compat['common/app']" ***!
  \***************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/app'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/Link":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/components/Link']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Link'];

/***/ }),

/***/ "flarum/common/components/LinkButton":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['common/components/LinkButton']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LinkButton'];

/***/ }),

/***/ "flarum/common/components/LoadingIndicator":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['common/components/LoadingIndicator']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LoadingIndicator'];

/***/ }),

/***/ "flarum/common/components/Modal":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Modal']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Modal'];

/***/ }),

/***/ "flarum/common/components/Page":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/components/Page']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Page'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/helpers/avatar":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/avatar']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/avatar'];

/***/ }),

/***/ "flarum/common/helpers/username":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/username']" ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/helpers/username'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/Stream'];

/***/ }),

/***/ "flarum/common/utils/classList":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/utils/classList']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/classList'];

/***/ }),

/***/ "flarum/common/utils/humanTime":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/utils/humanTime']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/humanTime'];

/***/ }),

/***/ "flarum/common/utils/mixin":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/utils/mixin']" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/mixin'];

/***/ }),

/***/ "flarum/common/utils/string":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/string']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/string'];

/***/ }),

/***/ "flarum/forum/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['forum/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/app'];

/***/ }),

/***/ "flarum/forum/components/IndexPage":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/IndexPage']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/IndexPage'];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/common */ "./src/common/index.ts");
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.ts");


})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map