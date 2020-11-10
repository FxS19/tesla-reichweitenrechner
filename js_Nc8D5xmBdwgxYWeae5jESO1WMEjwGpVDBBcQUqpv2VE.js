(function (window, document, $, Drupal) {
    Drupal.behaviors.chargiing_partner_form = {
        attach: function () {
            var $partner_details = $('#tesla-charging-partner-details');
            var $form = $('#tesla-charging-partner-form');
            var $zip_code = $('#edit-zipcode-cp');
            var $phone = $('#edit-phonenumber-cp');
            var $province_list = $('#edit-state-cp');
            var $province_list_wrapper = $('#province-wrapper');
            var $submit_button = $('#edit-submit-cp-ajax');
            $('#edit-countries-cp').change(function () {
                var url = (Drupal.settings.tesla.locale != 'en_US') ? "/" + Drupal.settings.tesla.locale : '';
                var country = $('#edit-countries-cp').val();
                $.ajax({
                    url: url + '/regex/' + country,
                    dataType: "json"
                }).success(function (data, textStatus, jqXHR) {
                    //Little hack to change the regex and message that parsley will do
                    $zip_code.attr('data-parsley-pattern', ((data.regex) ? (data.regex) : ('/^[a-zA-Z0-9\-\s]{1,}$/')));
                    $zip_code.attr('data-parsley-pattern-message', ((data.message) ? (data.message) : (Drupal.t('contains one or more illegal characters'))));
                    $zip_code.attr('maxlength', ((data.postal_code_max_length) ? (data.postal_code_max_length) : (6)));
                    $phone.val(data.phone_code);
                    //Reactivate the parsley validation
                    $zip_code.focusout();
                }).done(function (data, textStatus, jqXHR) {
                    //enable the submit button
                    $ajax_country = true;
                })

                $.post('/mytesla/get-states', {Country: country}, function (data) {
                    if (data.result == "") {
                        $province_list_wrapper.addClass("hidden");
                        $partner_details.addClass('no-province');
                        $province_list.attr('data-parsley-required', 'false');

                    } else {
                        $province_list_wrapper.removeClass("hidden");
                        $partner_details.removeClass('no-province');
                        $province_list.attr('data-parsley-required', 'true');
                    }
                    $province_list.empty().append(data.result);
                });
            });
            $.fn.scrollPageToMessage = function () {
              $("html, body").animate({scrollTop: $(".section-application").offset().top}, 1000)
            };
            $submit_button.click(function (event) {
                event.preventDefault(); //prevent default form submit
                var valid = $form.parsley().validate();
                if (valid) {
                    $('#form-content-cp .modal-throbber').removeClass('hidden');
                    $(this).trigger('submit_form');
                }
            });

        }
    }
}(this, this.document, this.jQuery, this.Drupal))
;
Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"Edit":"Bearbeiten","Please wait...":"Bitte haben Sie etwas Geduld...","Tuesday":"Dienstag","Other":"Andere","Select":"W\u00e4hlen","Save":"Speichern","February":"Februar","March":"M\u00e4rz","April":"April","May":"Mai","December":"Dezember ","Sunday":"Sonntag","Monday":"Montag","Wednesday":"Mittwoch","Thursday":"Donnerstag","Friday":"Freitag","Saturday":"Samstag","Submit":"Senden","We could not sign you in using the information you provided. Please try again.":"Wir konnten Sie mit den von Ihnen gemachten Angaben nicht anmelden. Bitte versuchen Sie es erneut.","Upload":"Hochladen","Close":"Schlie\u00dfen","For your security, please provide a password at least eight characters long that contains at least one number and one letter.":"W\u00e4hlen Sie zu Ihrer eigenen Sicherheit ein Passwort mit mindestens acht Zeichen, das zumindest eine Ziffer und einen Buchstaben enth\u00e4lt.","These passwords do not match.":"Diese Passw\u00f6rter korrespondieren nicht.","Price":"Preis","Email Address":"E-Mail-Adresse","CANCEL":"STORNIEREN","Continue":"FORTFAHREN","Cancel":"Abbrechen","- Select -":"- W\u00e4hlen -","Test Drive":"Probefahrt","This is not a valid email address format. Please try again.":"Ung\u00fcltiges Format der E-Mail-Adresse. Bitte versuchen Sie es erneut.","Confirm":"Best\u00e4tigen","required":"Pflichtfeld","Reserve your Powerwall":"Reservieren Sie Ihre Powerwall","Reserve":"Reservieren","Inquire about Tesla Energy for your Business or Utility":"Beantragen Sie weitere Informationen \u00fcber Tesla Energy f\u00fcr Betriebe und Stromversorger","Become a Powerwall Distribution Partner":"Powerwall-Vertriebspartner werden","Sign Up":"Registrieren","Hours and directions":"Stunden und Anfahrt","Place Order":"BESTELLUNG ABSCHICKEN","We are processing your order. Please wait.":"Wir bearbeiten Ihre Anfrage. Bitte haben Sie Geduld.","Your document uploaded successfully":"Das Hochladen Ihres Dokuments war erfolgreich.","Your document removed successfully":"Das L\u00f6schen Ihres Dokuments war erfolgreich.","Please specify a document name.":"Bitte benennen Sie das Dokument.","[.@ext] is not an allowed file extension, please upload documents only.":"[.@ext] ist keine zul\u00e4ssige Dateierweiterung. Bitte nur Dokumente hochladen.","Charge My Card":"BELASTEN SIE MEINE KARTE","Sign up and pay with wire transfer.":"Registrieren und per \u00dcberweisung zahlen.","Skip for now":"Vor\u00fcbergehend \u00fcberspringen","Save Design":"Konfiguration speichern"," Order Agreement":"Bestellvereinbarung","Inquire about Powerpack for your Business or Utility":"Informationen \u00fcber Powerpack f\u00fcr Ihren Betrieb oder Ihre Organisation","Become a Certified Powerwall Installer":"Zertifizierter Powerwall-Installationsbetrieb werden","Sorry, there was an error saving your new username, please try again.":"Leider ist beim Speichern Ihres neuen Anwendernamens ein Fehler aufgetreten. Bitte versuchen Sie es erneut.","Test drives are available at this location on request, we will call you within 24-48 hours to schedule a drive.":"Testfahrten an diesem Ort sind auf Anfrage m\u00f6glich, wir werden Sie innerhalb von 24-48 Stunden kontaktieren um mit Ihnen eine Fahrt auszumachen.","January":"Januar","Charge my card @deposit deposit":"@deposit ANZAHLUNG VON KREDITKARTE ABBUCHEN","hide details":"Einzelheiten ausblenden","view details":"Einzelheiten anzeigen","Place Your Order for @deposit":"Jetzt bestellen f\u00fcr @deposit","CHARGE MY CARD @deposit":"ABBUCHUNG VON @deposit BEST\u00c4TIGEN","We couldn\u0027t find that address. Click here to enter manually.":"Wir konnten diese Adresse nicht finden. Klicken Sie bitte hier, um sie manuell einzugeben."}} };;
function cache_buster_set_cookie(days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "expires="+date.toGMTString()+";";
    }
    else var expires = "";
    document.cookie = "NO_CACHE=Y;"+expires+"path=/";
};
(function (window, document, $, Drupal) {
    "use strict";

    Drupal.behaviors.tesla_user = {
        checkPassEmailField: function (origin) {
            var email = $('#edit-name').val();
            var form_error = 0;

            // if (!origin && Drupal.behaviors.common.checkEmail(email) == false) {
            //     form_error = 1;
            // }

            if (form_error === 0) {
                if (origin && origin === 'login') {
                    return Drupal.behaviors.tesla_user.submitLoginForm('login');
                }
                return Drupal.behaviors.tesla_user.submitPassForm();
            }
            return false;
        },
        submitLoginForm: function (mode, destination) {
            var form_error         = 0;
            var username_error     = 0;
            var username_error_msg = '';
            var pass_error         = 0;
            var pass_error_msg     = '';
            var display_msg        = '';
            // var top_offset = -30;

            if (mode === 'join') {
                window.location.href = destination;

            } else {
                if ($('#edit-name')) {
                    if ($('#edit-name').val() === '') {
                        form_error = 1;
                        username_error = 1;
                        username_error_msg = 'Please enter a username';
                        if (Drupal.settings.tesla.country === 'DE') {
                            username_error_msg = 'Benutzername eingeben.';

                        } else if (Drupal.settings.tesla.country === 'FR') {
                            username_error_msg = 'Veuillez entrer un username.';

                        } else if (Drupal.settings.tesla.country === 'IT') {
                            username_error_msg = 'Per favore inserisci uno username.';

                        } else if (Drupal.settings.tesla.country === 'NL') {
                            username_error_msg = 'Geef een gebruikersnaam in.';

                        } else if (Drupal.settings.tesla.country === 'JP') {
                            username_error_msg = 'ユーザー名を入力してください。';
                        }
                    }
                }

                if ($('#edit-pass')) {
                    if ($('#edit-pass').val() === '') {
                        form_error = 1;
                        pass_error = 1;
                        pass_error_msg = 'Please enter a password';
                        if (Drupal.settings.tesla.country === 'DE') {
                            pass_error_msg = 'Bitte geben Sie ein gültiges Passwort ein.';

                        } else if (Drupal.settings.tesla.country === 'FR') {
                            pass_error_msg = 'Veuiller entrer un mot de passe valide.';

                        } else if (Drupal.settings.tesla.country === 'IT') {
                            pass_error_msg = 'Per favore inserisci una password valida.';

                        } else if (Drupal.settings.tesla.country === 'NL') {
                            pass_error_msg = 'Geef een wachtwoord in.';

                        } else if (Drupal.settings.tesla.country === 'JP') {
                            pass_error_msg = '有効なパスワードを入力してください。';
                        }
                    }
                }

                if (form_error > 0) {

                    if ($('#messages-wrapper').length) {
                        if ($('#messages-wrapper').css('display') === 'block') {
                            $('#messages-wrapper').remove();
                        }
                    }

                    if (username_error === 1) {
                        $('label.edit-name').attr('class', 'label-error');
                        display_msg = username_error_msg;
                    }

                    if (pass_error === 1) {
                        $('label.edit-pass').attr('class', 'label-error');
                        display_msg = pass_error_msg;
                          // top_offset = 55;
                    }

                    if (username_error === 1 && pass_error === 1) {
                        display_msg = username_error_msg + '<br>' + pass_error_msg;
                        // top_offset = -26;
                    }

                    Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', display_msg);

                } else {
                    // create username for all cases
                    var tmp_cookie_val = $('#edit-name').val();
                    tmp_cookie_val = encodeURIComponent(tmp_cookie_val);
                    Drupal.behaviors.common.createCookie('tesla_username', tmp_cookie_val, 360);
                    document.forms['user-login'].submit();
                }
            }
        },
        submitPassForm: function (method) {
            if (method && method === 'cancel') {
                var dest          = $('#destination').val();
                var locale_prefix = '';
                if (Drupal.settings.tesla.locale !== 'en_US') {
                    locale_prefix = Drupal.settings.tesla.locale;
                    if (locale_prefix === 'ja_JP') {
                        locale_prefix = 'jp';
                    }
                    if (locale_prefix === 'zh_CN') {
                        locale_prefix = 'cn';
                    }
                    locale_prefix = '/' + locale_prefix;
                }

                dest = locale_prefix + '/user/login';
                window.location.href = dest;

            } else {
                var email = $('#edit-name').val();
                var form_error = 0;
                var $msgErr = '';
                if (!email.length) {
                    form_error = 1;
                    $msgErr = Drupal.t('Username or e-mail address field is required.');
                }
                if (form_error === 0) {
                    document.forms['user-pass'].submit();

                } else {
                    Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', $msgErr);
                }
            }
        },
        displayError: function (insert, position, message) {
            $('.messages.error').remove();
            if (position === 'prepend') {
                insert.prepend('<div class="messages error">' + message + '</div>');
            }
            if (position === 'append') {
                insert.append('<div class="messages error">' + message + '</div>');
            }
            if (position === 'html') {
                insert.html('<div class="messages error">' + message + '</div>');
            }
        },
        useremailCheck: function (emailField) {
            var loginField     = emailField;
            var $locale_prefix =  Drupal.settings.tesla.localePrefix;
            Drupal.useremailCheckUseremail = loginField.val();
            var $error = $('.messages');

            if (!$error.hasClass('error')) {
                $error.addClass('error');
            }
            if (Drupal.useremailCheckUseremail.length) {
                $.ajax({
                    url: $locale_prefix + '/useremail_check/isunique',
                    data: {
                        useremail: Drupal.useremailCheckUseremail
                    },
                    dataType: 'json',
                    beforeSend: function () {
                        loginField.removeClass('useremail-check-accepted')
                            .removeClass('useremail-check-rejected')
                            .addClass('useremail-check-progress');
                    },
                    success: function (ret) {
                        if (ret['allowed']) {
                            $error.empty().hide();
                            loginField.addClass('useremail-check-accepted'); // DDS-1595

                        } else {
                            Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', ret['msg']);
                            loginField.addClass('useremail-check-rejected'); // DDS-1595
                        }
                        // checkCreateAcctFields('usermail_check_unique');
                    }
                });
            }
        },
        // check fields on each key input & only activate continue button when fields are filled
        checkCreateAcctFields: function (origin) {
            var form_error = 0;

            if (origin) {
                var fname            = $('#edit-first-name').val();
                var lname            = $('#edit-last-name').val();
                var password         = $('#edit-pass-pass1').val();
                var password_confirm = $('#edit-pass-pass2').val();

                // WEB-8822 / TFM
                // --------------
                if ($("#recaptcha_widget").length) {
                    var captcha = $('#recaptcha_response_field').val();
                }
                // --------------

                if (fname === '') {
                    form_error = 1;

                } else if (lname === '') {
                    form_error = 1;

                } else if (password === '') {
                    form_error = 1;

                } else if (password_confirm === '') {
                    form_error = 1;

                // WEB-8822 / TFM
                // --------------
                } else if (captcha === '') {
                    form_error = 1;
                }
                // --------------

                if ($('.password-description').length &&
                        $('.password-description').css('display') === 'block' &&
                        $('#edit-pass-pass2').length &&
                        $('#edit-pass-pass2').val() !== '') {
                    $('.password-description').css('display', 'none');
                }
            }

            if (form_error === 0) {
                // ------------------------
                Drupal.behaviors.tesla_user.submitCreateAcctForm(origin);
                // $('#btnCreateAccount').keyup(function(event) {
                //     Drupal.behaviors.common.checkKeyPressed(event);
                // });
            }
        },
        submitCreateAcctForm: function (origin) {
            var form_error = 0;
            var error_msg  = '';

            // WEB-8822 / TFM
            // --------------
            var uname = $('#edit-name').val();
            // --------------

            var email    = $('#edit-mail').val();
            var is_shell = $('#edit-is-shell').val();
            if (origin) {
                var fname            = $('#edit-first-name').val();
                var lname            = $('#edit-last-name').val();
                var password         = $('#edit-pass-pass1').val();
                var password_confirm = $('#edit-pass-pass2').val();

                var hasLetters     = password.match(/[a-zA-Z]+/);
                var hasNumbers     = password.match(/[0-9]+/);
                var hasPunctuation = password.match(/[^a-zA-Z0-9]+/);
                var hasCasing      = password.match(/[a-z]+.*[A-Z]+|[A-Z]+.*[a-z]+/);

                if (fname === '') {
                    form_error = 1;
                }
                if (lname === '') {
                    form_error = 1;
                }
                if (password === '') {
                    form_error = 1;
                }
                if (password_confirm === '') {
                    form_error = 1;
                }
            }

            if (Drupal.behaviors.common.checkEmail(email) === false) {
                form_error = 1;
                error_msg = 'This is not a valid email address format. Please try again.';
            }
            if (password !== password_confirm) {
                form_error = 1;
            }
            if (form_error === 0) {
                if (password.length < 8) {
                    error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');
                    form_error = 1;

                } else if (password === uname) {
                    error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');
                    form_error = 1;

                } else {
                    var count = (hasLetters ? 1 : 0) + (hasNumbers ? 1 : 0);
                    var strength_pass = count > 1 ? 'pass' : 'fail';
                    if (strength_pass === 'fail') {
                        error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');
                        form_error = 1;
                    }
                }
            }

            if (form_error === 1) {
                Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend' , error_msg);

            } else {
                // create login and username cookies
                var tesla_username_cookie = Drupal.behaviors.common.readCookie('tesla_username');
                var tesla_email_cookie = Drupal.behaviors.common.readCookie('tesla_email');

                // create username save cookie
                // in all cases
                if (tesla_username_cookie) {
                    Drupal.behaviors.common.eraseCookie('tesla_username');
                }
                var tmp_cookie_val = $('#edit-name').val();
                tmp_cookie_val = encodeURIComponent(tmp_cookie_val);
                Drupal.behaviors.common.createCookie('tesla_username',tmp_cookie_val);

                // create email save cookie
                // in all cases
                if (tesla_email_cookie) {
                    Drupal.behaviors.common.eraseCookie('tesla_email');
                }
                var tmp_cookie_val = $('#edit-mail').val();
                tmp_cookie_val = encodeURIComponent(tmp_cookie_val);
                Drupal.behaviors.common.createCookie('tesla_email', tmp_cookie_val);

                if (is_shell && is_shell === 'true') {
                    debug.log('set the form action');
                    var form_action = $('#edit-shell-url').val();
                    $('#user-register').attr('action', form_action);
                }
                document.forms['user-register-form'].submit();
            }
        },
        checkResetPasswordFields: function (action) {
            $('#user-pass-reset').submit(function () {
                return false;
            });
            var $error           = $('.messages').addClass('error');
            var form_error       = 0;
            var password         = $('#edit-pass-pass1').val();
            var password_confirm = $('#edit-pass-pass2').val();
            var username         = $('#edit-username').val();
            var url_array        = $('#edit-request_url').val().split('/');
            var timestamp        = url_array.slice(-2)[0];
            var hash             = url_array.slice(-2)[1];

            var error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');

            $('label[for="edit-pass"]').css('color', '#666666');
            $('label[for="edit-pass-confirm"]').css('color', '#666666');

            if (password === '' || password === null) {
                form_error = 1;
            }
            if (password_confirm === '' || password_confirm === null) {
                form_error = 1;
            }

            if (action === 'submit') {
                var hasLetters     = password.match(/[a-zA-Z]+/);
                var hasNumbers     = password.match(/[0-9]+/);
                var hasPunctuation = password.match(/[^a-zA-Z0-9]+/);
                var hasCasing      = password.match(/[a-z]+.*[A-Z]+|[A-Z]+.*[a-z]+/);

                if (password.length < 8) {
                    form_error = 1;

                } else if (password === username) {
                    error_msg = Drupal.t('Your password cannot be the same as your username.');
                    form_error = 1;

                } else {
                    var count = (hasLetters ? 1 : 0) + (hasNumbers ? 1 : 0);
                    var strength_pass = count > 1 ? "pass" : "fail";

                    if (strength_pass === 'fail') {
                        error_msg = Drupal.t('For your security, please provide a password at least eight characters long that contains at least one number and one letter.');
                        form_error = 1;
                    }
                }

            }

            if (form_error === 0) {
                if (action === 'submit') {
                    var userid        = $('#edit-uid').val();
                    var page_origin   = 'reset';
                    var locale_prefix =  Drupal.settings.tesla.localePrefix;

                    $.post(locale_prefix + '/user/reset-password', {
                        uid: userid,
                        pass: password,
                        origin: page_origin,
                        hash: hash,
                        timestamp: timestamp
                    }, function (response) {
                        if (!response.success) {
                            Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', response.message);

                        } else {
                            Gatekeeper.settings = Drupal.settings.Gatekeeper;
                            Gatekeeper.Helpers.setCookies(name);
                            Gatekeeper.Helpers.startSession(response.auth.data, response.auth.region);
                        }
                    });
                }
            } else {
                if (!$error.hasClass('error')) {
                    $error.addClass('error');
                }
                Drupal.behaviors.tesla_user.displayError($('.my-form-wrapper'), 'prepend', error_msg);
            }
        },
        attach: function (context, settings) {
            if ($('#messages-wrapper').length) {
                $('.my-form-wrapper').prepend($('#messages-wrapper div'));
            }
        }
    };
}(this, this.document, this.jQuery, this.Drupal));
;
