'use strict';

const _ = require('underscore');
const $ = require('jquery');
const Backbone = require('backbone');

class ModelView extends Backbone.View {
  render() {
    let data = this.serializeData();
    let renderedHtml;

    if (_.isFunction(this.template)) {
      renderedHtml = this.template(data);
    } else if (_.isString(this.template)) {
      let compiledTemplate = this.compileTemplate();
      renderedHtml = compiledTemplate(data);
    }

    this.$el.html(renderedHtml);

    if (this.onRender) {
      this.onRender();
    }

    return this;
  }
  compileTemplate() {
    let $el = $(this.template);
    return _.template($el.html());
  }
  serializeData() {
    let data;

    if (this.model) {
      data = this.model.toJSON();
    }

    return data;
  }
}

class CollectionView extends Backbone.View {
  initialize() {
    this.children = {};

    this.listenTo(this.collection, 'add', this.modelAdded);
    this.listenTo(this.collection, 'remove', this.modelRemoved);
    this.listenTo(this.collection, 'reset', this.render);
  }
  modelAdded(model) {
    let view = this.renderModel(model);
    this.$el.append(view.$el);
  }
  modelRemoved(model) {
    if (!model) return;

    let view = this.children[model.cid];
    this.closeChildView(view);
  }

  render() {
    this.closeChildren();

    let html = this.collection.map(model => {
      let view = this.renderModel(model);
      return view.$el;
    });

    this.$el.html(html);
    return this;
  }

  renderModel(model) {
    let view = new this.modelView({model: model});

    this.children[model.cid] = view;

    this.listenTo(view, 'all', eventName => {
      this.trigger('item:' + eventName, view, model);
    });

    view.render();
    return view;
  }
  remove() {
    Backbone.View.prototype.remove.call(this);
    this.closeChildren();
  }
  closeChildren() {
    let children = this.children || {};
    _.each(children, child => this.closeChildView(child));
  }
  closeChildView(view) {
    if (!view) return;

    if (_.isFunction(view.remove)) {
      view.remove();
    }

    this.stopListening(view);

    if (view.model) {
      this.children[view.model.cid] = undefined;
    }
  }
}

class Region {
  constructor(options) {
    this.el = options.el;
  }
  show(view) {
    this.closeView(this.currentView);
    this.currentView = view;
    this.openView(view);
  }

  closeView(view) {
    if (view && view.remove) {
      view.remove();
    }
  }

  openView(view) {
    this.ensureEl();

    view.render();
    this.$el.html(view.el);

    if (view.onShow) {
      view.onShow();
    }
  }
  ensureEl() {
    if (this.$el) return;
    this.$el = $(this.el);
  }
  remove() {
    this.closeView(this.currentView);
  }
}

class Layout extends ModelView {
  render() {
    this.closeRegions();

    let result = ModelView.prototype.render.call(this);

    this.configureRegions();
    return result;
  }

  configureRegions() {
    let regionDefinitions = this.regions || {};

    if (!this._regions) {
      this._regions = {};
    }

    _.each(regionDefinitions, (selector, name) => {
      let $el = this.$(selector);
      this._regions[name] = new Region({el: $el});
    });
  }
  getRegion(regionName) {
    let regions = this._regions || {};
    return regions[regionName];
  }
  remove(options) {
    ModelView.prototype.remove.call(this, options);
    this.closeRegions();
  }

  closeRegions() {
    let regions = this._regions || {};

    _.each(regions, region => {
      if (region && region.remove) region.remove();
    });
  }
}

module.exports = {ModelView, CollectionView, Region, Layout};
