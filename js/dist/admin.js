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

/***/ "./src/admin/components/DependencyCollectorSettingsPage.js":
/*!*****************************************************************!*\
  !*** ./src/admin/components/DependencyCollectorSettingsPage.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DependencyCollectorSettingsPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/components/ExtensionPage */ "flarum/admin/components/ExtensionPage");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _EditTagModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./EditTagModal */ "./src/admin/components/EditTagModal.js");
/* harmony import */ var flarum_common_utils_Alert__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/Alert */ "flarum/common/utils/Alert");
/* harmony import */ var flarum_common_utils_Alert__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Alert__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/withAttr */ "flarum/common/utils/withAttr");
/* harmony import */ var flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_6__);

// js/src/admin/components/DependencyCollectorSettingsPage.js







var DependencyCollectorSettingsPage = /*#__PURE__*/function (_ExtensionPage) {
  function DependencyCollectorSettingsPage() {
    return _ExtensionPage.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DependencyCollectorSettingsPage, _ExtensionPage);
  var _proto = DependencyCollectorSettingsPage.prototype;
  _proto.oninit = function oninit(vnode) {
    _ExtensionPage.prototype.oninit.call(this, vnode);
    this.loadingTags = true;
    this.pluginTags = [];
    this.loadPluginTags();
    this.editingTagId = null;
    this.editingField = null;
    this.editValue = '';
    this.savingTagId = null;
  };
  _proto.content = function content() {
    return m("div", {
      className: "DependencyCollectorSettingsPage"
    }, m("div", {
      className: "container"
    }, this.pluginTagsSection()));
  };
  _proto.pluginTagsSection = function pluginTagsSection() {
    var _this = this;
    return m("section", {
      className: "PluginTagsSection"
    }, m("h2", null, app.translator.trans('shebaoting-dependency-collector.admin.page.manage_tags_title')), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button Button--primary",
      icon: "fas fa-plus",
      onclick: function onclick() {
        return app.modal.show(_EditTagModal__WEBPACK_IMPORTED_MODULE_4__["default"], {
          key: 'new-tag',
          onsave: _this.loadPluginTags.bind(_this)
        });
      }
    }, app.translator.trans('shebaoting-dependency-collector.admin.actions.create_tag')), this.loadingTags ? m((flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_3___default()), null) : this.pluginTags.length === 0 ? m("p", null, app.translator.trans('shebaoting-dependency-collector.admin.page.no_plugin_tags')) : m("table", {
      className: "Table PluginTagsTable"
    }, m("thead", null, m("tr", null, m("th", null, app.translator.trans('shebaoting-dependency-collector.admin.table.tag_name')), m("th", null, app.translator.trans('shebaoting-dependency-collector.admin.table.tag_slug')), m("th", null, app.translator.trans('shebaoting-dependency-collector.admin.table.tag_color')), " ", m("th", null, app.translator.trans('shebaoting-dependency-collector.admin.table.tag_icon')), " ", m("th", null, app.translator.trans('shebaoting-dependency-collector.admin.table.tag_item_count')), m("th", null, app.translator.trans('shebaoting-dependency-collector.admin.table.actions')))), m("tbody", null, this.pluginTags.map(function (tag) {
      return m("tr", {
        key: tag.id(),
        className: _this.savingTagId === tag.id() ? 'saving' : ''
      }, m("td", {
        onclick: function onclick() {
          return _this.startEditing(tag, 'name');
        }
      }, _this.isEditing(tag, 'name') ? _this.renderInput(tag, 'name', 'text') : tag.name()), m("td", {
        onclick: function onclick() {
          return _this.startEditing(tag, 'slug');
        }
      }, _this.isEditing(tag, 'slug') ? _this.renderInput(tag, 'slug', 'text') : tag.slug()), m("td", {
        onclick: function onclick() {
          return _this.startEditing(tag, 'color');
        }
      }, _this.isEditing(tag, 'color') ? _this.renderInput(tag, 'color', 'text', '#RRGGBB') // 使用 renderInput 辅助方法
      : tag.color() ? m("span", {
        style: {
          backgroundColor: tag.color(),
          padding: '2px 5px',
          color: _this.getTextColorForBackground(tag.color()),
          borderRadius: '3px',
          cursor: 'pointer'
        }
      }, tag.color()) : m("span", {
        style: "cursor: pointer; color: #aaa;"
      }, "(none)") // 提供无颜色时的点击区域
      ), m("td", {
        onclick: function onclick() {
          return _this.startEditing(tag, 'icon');
        }
      }, _this.isEditing(tag, 'icon') ? _this.renderInput(tag, 'icon', 'text', 'fas fa-tag') // 使用 renderInput 辅助方法
      : tag.icon() ? m("i", {
        className: tag.icon(),
        style: "cursor: pointer;"
      }) : m("span", {
        style: "cursor: pointer; color: #aaa;"
      }, "(none)")), m("td", null, tag.itemCount() !== undefined ? tag.itemCount() : 'N/A'), m("td", null, m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
        className: "Button Button--icon Button--danger",
        icon: "fas fa-trash",
        onclick: function onclick() {
          return _this.deleteTag(tag);
        },
        "aria-label": app.translator.trans('core.admin.basics.delete_button')
      })));
    }))));
  }

  // --- 新增：渲染内联输入框的辅助方法 ---
  ;
  _proto.renderInput = function renderInput(tag, field, type, placeholder) {
    var _this2 = this;
    if (type === void 0) {
      type = 'text';
    }
    if (placeholder === void 0) {
      placeholder = '';
    }
    return m("input", {
      className: "FormControl FormControl--inline",
      type: type,
      value: this.editValue,
      placeholder: placeholder,
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_6___default()('value', function (val) {
        return _this2.editValue = val;
      }),
      onblur: function onblur(e) {
        return _this2.saveEdit(tag, field, e.target.value);
      },
      onkeydown: function onkeydown(e) {
        return _this2.handleKeyDown(e, tag, field, e.target.value);
      },
      onupdate: function onupdate(vnode) {
        return _this2.focusInput(vnode);
      }
    });
  }

  // isEditing 方法保持不变
  ;
  _proto.isEditing = function isEditing(tag, field) {
    return this.editingTagId === tag.id() && this.editingField === field;
  }

  // startEditing 方法保持不变
  ;
  _proto.startEditing = function startEditing(tag, field) {
    if (this.savingTagId) return;
    this.editingTagId = tag.id();
    this.editingField = field;
    this.editValue = tag[field]() || '';
    m.redraw();
  }

  // focusInput 方法保持不变
  ;
  _proto.focusInput = function focusInput(vnode) {
    if (vnode.dom && typeof vnode.dom.focus === 'function') {
      setTimeout(function () {
        return vnode.dom.focus();
      }, 0);
    }
  }

  // handleKeyDown 方法保持不变
  ;
  _proto.handleKeyDown = function handleKeyDown(event, tag, field, value) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEdit(tag, field, value);
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
    event.redraw = false;
  }

  // saveEdit 方法保持不变
  ;
  _proto.saveEdit = function saveEdit(tag, field, value) {
    var _attributesToSave,
      _this3 = this;
    if (this.savingTagId === tag.id()) {
      console.log('Save already in progress for tag:', tag.id());
      return;
    }
    if (value === (tag[field]() || '')) {
      this.cancelEdit();
      return;
    }
    this.savingTagId = tag.id();
    m.redraw();
    var attributesToSave = (_attributesToSave = {}, _attributesToSave[field] = value, _attributesToSave);
    console.log('Data being passed to tag.save():', attributesToSave);
    tag.save(attributesToSave).then(function () {
      console.log('Tag saved successfully.');
      _this3.cancelEdit();
    })["catch"](function (error) {
      var _error$response;
      console.error("Error saving tag " + tag.id() + " field " + field + ":", error);
      var errorDetail = app.translator.trans('core.lib.error.generic_message');
      if (((_error$response = error.response) == null || (_error$response = _error$response.errors) == null ? void 0 : _error$response.length) > 0) {
        var fieldError = error.response.errors.find(function (e) {
          var _e$source;
          return ((_e$source = e.source) == null ? void 0 : _e$source.pointer) === "/data/attributes/" + field;
        });
        errorDetail = (fieldError == null ? void 0 : fieldError.detail) || error.response.errors[0].detail || errorDetail;
      }
      flarum_common_utils_Alert__WEBPACK_IMPORTED_MODULE_5__.alert.component({
        type: 'error'
      }, errorDetail);
      _this3.savingTagId = null;
      m.redraw();
    });
  }

  // cancelEdit 方法保持不变
  ;
  _proto.cancelEdit = function cancelEdit() {
    this.editingTagId = null;
    this.editingField = null;
    this.editValue = '';
    this.savingTagId = null;
    m.redraw();
  }

  // loadPluginTags 方法保持不变
  ;
  _proto.loadPluginTags = function loadPluginTags() {
    var _this4 = this;
    this.loadingTags = true;
    // 确保请求包含 itemCount (如果后端支持 sort=itemCount 或 include=itemCount)
    // 否则依赖 serializer 计算
    app.store.find('dependency-tags', {
      sort: 'name'
    }).then(function (tags) {
      _this4.pluginTags = tags;
      _this4.loadingTags = false;
      m.redraw();
    })["catch"](function () {
      _this4.loadingTags = false;
      m.redraw();
    });
  }

  // deleteTag 方法保持不变
  ;
  _proto.deleteTag = function deleteTag(tag) {
    var _this5 = this;
    if (this.savingTagId === tag.id()) return;
    if (!confirm(app.translator.trans('shebaoting-dependency-collector.admin.confirm.delete_tag', {
      name: tag.name()
    }))) return;
    tag["delete"]().then(function () {
      _this5.pluginTags = _this5.pluginTags.filter(function (t) {
        return t.id() !== tag.id();
      });
      m.redraw();
    })["catch"](function (e) {
      console.error(e);
      flarum_common_utils_Alert__WEBPACK_IMPORTED_MODULE_5__.alert.component({
        type: 'error'
      }, 'Error deleting tag.');
    });
  }

  // getTextColorForBackground 方法保持不变
  ;
  _proto.getTextColorForBackground = function getTextColorForBackground(hexColor) {
    if (!hexColor) return 'white';
    hexColor = hexColor.replace('#', '');
    if (hexColor.length === 3) {
      hexColor = hexColor[0].repeat(2) + hexColor[1].repeat(2) + hexColor[2].repeat(2);
    }
    if (hexColor.length !== 6) {
      return 'white';
    }
    var r = parseInt(hexColor.substr(0, 2), 16);
    var g = parseInt(hexColor.substr(2, 2), 16);
    var b = parseInt(hexColor.substr(4, 2), 16);
    var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };
  return DependencyCollectorSettingsPage;
}((flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/admin/components/EditTagModal.js":
/*!**********************************************!*\
  !*** ./src/admin/components/EditTagModal.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditTagModal)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_components_Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/components/Modal */ "flarum/admin/components/Modal");
/* harmony import */ var flarum_admin_components_Modal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_Modal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_ColorPreviewInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/ColorPreviewInput */ "flarum/common/components/ColorPreviewInput");
/* harmony import */ var flarum_common_components_ColorPreviewInput__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_ColorPreviewInput__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_5__);

// js/src/admin/components/EditTagModal.js






var EditTagModal = /*#__PURE__*/function (_Modal) {
  function EditTagModal() {
    return _Modal.apply(this, arguments) || this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(EditTagModal, _Modal);
  var _proto = EditTagModal.prototype;
  _proto.oninit = function oninit(vnode) {
    _Modal.prototype.oninit.call(this, vnode);
    this.tag = this.attrs.tag || flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().store.createRecord('dependency-tags');
    this.name = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.tag.name() || '');
    this.slug = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.tag.slug() || '');
    this.description = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.tag.description() || '');
    this.color = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.tag.color() || '#cccccc');
    this.icon = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()(this.tag.icon() || '');
    this.alertAttrs = null;
  };
  _proto.className = function className() {
    return 'EditTagModal Modal--small';
  };
  _proto.title = function title() {
    return this.tag.exists ? flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('shebaoting-dependency-collector.admin.modal.edit_tag_title', {
      name: this.tag.name()
    }) : flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('shebaoting-dependency-collector.admin.modal.create_tag_title');
  };
  _proto.content = function content() {
    // 策略：移除 content() 内部所有元素的 key 属性，
    // 依赖 Mithril 对无 key 列表的处理。
    // Modal-body 和 Form 保持无 key。
    // 所有 Form-group 也保持无 key。
    // 对于 app.translator.trans 返回的数组，如果其内部的 <a> 也没有 key，
    // 那么整个子数组就是“无 key”的，这应该是允许的。
    return m("div", {
      className: "Modal-body"
    }, m("div", {
      className: "Form"
    }, m("div", {
      className: "Form-group"
    }, ' ', m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('shebaoting-dependency-collector.admin.modal.tag_name_label')), m("input", {
      className: "FormControl",
      bidi: this.name
    })), m("div", {
      className: "Form-group"
    }, ' ', m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('shebaoting-dependency-collector.admin.modal.tag_slug_label')), m("input", {
      className: "FormControl",
      bidi: this.slug
    })), m("div", {
      className: "Form-group"
    }, ' ', m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('shebaoting-dependency-collector.admin.modal.tag_description_label')), m("textarea", {
      className: "FormControl",
      bidi: this.description,
      rows: "3"
    })), m("div", {
      className: "Form-group"
    }, ' ', m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('shebaoting-dependency-collector.admin.modal.tag_color_label')), m((flarum_common_components_ColorPreviewInput__WEBPACK_IMPORTED_MODULE_4___default()), {
      className: "FormControl",
      bidi: this.color
    })), m("div", {
      className: "Form-group"
    }, ' ', m("label", null, flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('shebaoting-dependency-collector.admin.modal.tag_icon_label')), m("input", {
      className: "FormControl",
      bidi: this.icon,
      placeholder: "fas fa-code"
    }), m("small", null, ' ', flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('shebaoting-dependency-collector.admin.modal.tag_icon_help', {
      link: m("a", {
        href: "https://fontawesome.com/icons",
        tabindex: "-1",
        target: "_blank"
      }, "Font Awesome")
    }))), m("div", {
      className: "Form-group"
    }, ' ', m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      type: "submit",
      className: "Button Button--primary",
      loading: this.loading,
      "aria-label": flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('core.lib.save_button')
    }, flarum_admin_app__WEBPACK_IMPORTED_MODULE_5___default().translator.trans('core.lib.save_button')))));
  };
  _proto.onsubmit = function onsubmit(e) {
    var _this = this;
    e.preventDefault();
    this.loading = true;
    this.alertAttrs = null;
    this.tag.save({
      name: this.name(),
      slug: this.slug(),
      description: this.description(),
      color: this.color(),
      icon: this.icon()
    }).then(function () {
      if (_this.attrs.onsave) _this.attrs.onsave();
      _this.hide();
    })["catch"](function (error) {
      if (error.alert) {
        _this.alertAttrs = error.alert;
      } else {
        console.error(error);
      }
    })["finally"](function () {
      _this.loading = false;
      m.redraw();
    });
  };
  return EditTagModal;
}((flarum_admin_components_Modal__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/admin/index.ts":
/*!****************************!*\
  !*** ./src/admin/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_DependencyCollectorSettingsPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/DependencyCollectorSettingsPage */ "./src/admin/components/DependencyCollectorSettingsPage.js");
/* harmony import */ var _common_models_DependencyItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/models/DependencyItem */ "./src/common/models/DependencyItem.js");
/* harmony import */ var _common_models_DependencyTag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/models/DependencyTag */ "./src/common/models/DependencyTag.js");

 // We will create this
 // If needed in admin
 // If needed in admin

flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().initializers.add('shebaoting-dependency-collector-admin', function () {
  (flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().store).models['dependency-items'] = _common_models_DependencyItem__WEBPACK_IMPORTED_MODULE_2__["default"];
  (flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().store).models['dependency-tags'] = _common_models_DependencyTag__WEBPACK_IMPORTED_MODULE_3__["default"];

  // Register your extension page
  flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().extensionData["for"]('shebaoting-dependency-collector').registerPage(_components_DependencyCollectorSettingsPage__WEBPACK_IMPORTED_MODULE_1__["default"]).registerPermission({
    icon: 'fas fa-pencil-alt',
    // Example icon
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('shebaoting-dependency-collector.admin.permissions.submit_label'),
    permission: 'dependency-collector.submit'
  }, 'start' // Permission group: start, moderate, etc.
  ).registerPermission({
    icon: 'fas fa-check-double',
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('shebaoting-dependency-collector.admin.permissions.moderate_label'),
    permission: 'dependency-collector.moderate',
    allowGuest: false // Example: Don't allow guests
  }, 'moderate').registerPermission({
    icon: 'fas fa-tags',
    label: flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default().translator.trans('shebaoting-dependency-collector.admin.permissions.manage_tags_label'),
    permission: 'dependency-collector.manageTags'
  }, 'moderate' // Or a new group like 'manage'
  );
  // Add more permissions as needed
});

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
    return _this;
  }
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(DependencyItem, _Model);
  var _proto = DependencyItem.prototype;
  // 确保 canApprove 属性存在
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

/***/ "flarum/admin/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['admin/app']" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/app'];

/***/ }),

/***/ "flarum/admin/components/ExtensionPage":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['admin/components/ExtensionPage']" ***!
  \***********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/ExtensionPage'];

/***/ }),

/***/ "flarum/admin/components/Modal":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['admin/components/Modal']" ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['admin/components/Modal'];

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

/***/ "flarum/common/components/ColorPreviewInput":
/*!****************************************************************************!*\
  !*** external "flarum.core.compat['common/components/ColorPreviewInput']" ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/ColorPreviewInput'];

/***/ }),

/***/ "flarum/common/components/LoadingIndicator":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['common/components/LoadingIndicator']" ***!
  \***************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/LoadingIndicator'];

/***/ }),

/***/ "flarum/common/utils/Alert":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/utils/Alert']" ***!
  \***********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/Alert'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/Stream'];

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

/***/ "flarum/common/utils/withAttr":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/withAttr']" ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/withAttr'];

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
  !*** ./admin.ts ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/common */ "./src/common/index.ts");
/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.ts");


})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=admin.js.map