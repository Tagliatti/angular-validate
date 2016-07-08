(function (angular, $) {
    angular.module('ngValidate', [])

        .directive('ngValidate', function () {
            return {
                restrict: 'A',
                require: '^form',
                scope: {
                    ngValidate: '='
                },
                link: function (scope, element, attrs, form) {
                    var validator = element.validate(scope.ngValidate);

                    if (!element.is('form'))
                        throw new Error("ng-validate must be set on a form elment!");

                    form.validate = function (options) {
                        var oldSettings = validator.settings;

                        validator.settings = $.extend(true, {}, validator.settings, options);

                        var valid = validator.form();

                        validator.settings = oldSettings; // Reset to old settings

                        return valid;
                    };
                    
                    form.resetForm = function () {
                        validator.resetForm();
                    };

                    form.numberOfInvalids = function () {
                        return validator.numberOfInvalids();
                    };
                }
            };
        })

        .directive('validateSubmit', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                require: '?form',
                controller: [function () {
                }],
                link: function(scope, formElement, attrs, controllers) {
                    var formController = controllers || null;

                    var fn = $parse(attrs.validateSubmit);

                    formElement.bind('submit', function (event) {
                        if (!scope.$$phase) {
                            scope.$apply();
                        }

                        if (!formController.validate()) {
                            return false;
                        }

                        scope.$apply(function() {
                            fn(scope, {
                                $event: event
                            });
                            event.preventDefault();
                        });
                    });
                }
            }
        }])

        .directive('validateReset', [function () {
            return {
                restrict: 'A',
                require: '^form',
                link: function (scope, element, attrs, form) {
                    element.bind('click', function (event) {
                        form.resetForm();
                    });
                }
            }
        }])

        .provider('$validator', function () {
            $.validator.setDefaults({
                onsubmit: false // to prevent validating twice
            });

            return {
                setDefaults: function (options) {
                    $.validator.setDefaults(options);
                },
                addMethod: function (name, method, message) {
                    $.validator.addMethod(name, method, message);
                },
                $get: function () {
                    return {};
                }
            };
        });
}(angular, jQuery));
