/*globals Backbone, jQuery, Modernizr, Handlebars */

var Planbox = Planbox || {};

(function(NS, $) {
  'use strict';

  // Exceptions ===============================================================
  NS.projectException = function(message, data) {
    return genericException('ProjectException', message, data);
  };

  // App ======================================================================
  NS.app.addInitializer(function(options){
    var ProjectView;

    if (NS.Data.isEditable && !NS.Data.project.owner_id) {
      NS.Data.project.owner = _.clone(NS.Data.owner);
    }

    if (NS.Data.isEditable) {
      NS.app.plugins = [];
      NS.app.plugins.push(new NS.ShareaboutsProjectEditorPlugin(NS.app));
    }

    NS.app.projectModel = new NS.ProjectModel(NS.Data.project);
    NS.app.sectionCollection = NS.app.projectModel.get('sections');

    if (!NS.Data.isEditable) {
      ProjectView = NS.ProjectView;
      NS.app.sectionCollection = new Backbone.Collection(NS.app.projectModel.get('sections').filter(function(model) {
        return model.get('active');
      }));
    } else {
      ProjectView = NS.ProjectAdminView;
    }

    NS.app.mainRegion.show(new ProjectView({
      className: NS.app.projectModel.get('layout') + '-page',
      model: NS.app.projectModel,
      collection: NS.app.sectionCollection
    }));

    if (window.location.pathname.indexOf('/new/') !== -1 && NS.Data.isEditable) {
      // NS.showProjectSetupModal(projectModel);
      // NS.app.overlayRegion.show(new NS.WelcomeModalView());
    }
  });

  NS.app.addInitializer(function(options) {
    // Protect the user from leaving before saving.
    window.addEventListener('beforeunload', function(e) {
      var notification = 'It looks like you have unsaved changes in your project.';
      e = e || event;

      if (NS.app.projectModel.isDirty) {
        // set and return for browser compatibility
        // https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
        e.returnValue = notification;
        return notification;
      }

      // Close the project
      NS.app.projectModel.markAsClosed();
    }, false);
  });

  NS.app.addInitializer(function(options) {
    if (NS.Data.isEditable) {
      NS.Utils.logEvents('body', 'project-editor');
    } else {
      NS.Utils.logEvents('body', 'project-page');
    }
  });

}(Planbox, jQuery));