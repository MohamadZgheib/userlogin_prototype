$(document).ready(function() {
    console.log("Document is ready.");

    // Initialize Select2 elements
    $('#systemSelect, #primaryRole, #secondaryRole').select2();
    console.log("Select2 initialized.");

    // Toggle Medallia related fields
    function toggleMedalliaFields(show) {
        console.log(`Toggling Medallia fields: ${show}`);
        $('#medalliaFields').toggleClass('hidden', !show);
    }

    // Sanitize ID by removing invalid characters and replacing special characters
    function sanitizeId(id) {
        return id.replace(/[\[\] &]/g, '-'); // Replace `[`, `]`, spaces, and `&` with `-`
    }

    // Handle Employee ID input and autofill data
    function handleEmployeeData(employeeId) {
        console.log(`Handling Employee ID: ${employeeId}`);
        const employeeData = {
            '123': {
                firstName: 'Mohamad',
                lastName: 'Zgheib',
                email: 'muhammad@newmetrics.com',
                language: 'English',
                primaryRole: '[CX] Services',
                primaryAccess: {
                    'Episode Name': ['Basic Inquiry or Information Access'],
                    'Respondent Type': ['Employer']
                },
                secondaryRoles: ['[CX] Assisted Channels'],
                secondaryAccess: {
                    '[CX] Assisted Channels': {
                        'Channel Name': ['Customer Service Toll-Free Number'],
                        'Respondent Type': ['Contributor']
                    }
                }
            },
            '1234': {
                firstName: 'Tareq',
                lastName: 'Bahamid',
                email: 'tariq@gosi.com',
                language: 'Arabic',
                primaryRole: undefined, // No primary role
                primaryAccess: {}, // No primary access
                secondaryRoles: [], // No secondary roles
                secondaryAccess: {} // No secondary access
            }
        };
        const data = employeeData[employeeId] || { firstName: '', lastName: '', email: '', language: '' };
        $('#firstName').val(data.firstName);
        $('#lastName').val(data.lastName);
        $('#email').val(data.email);
        $('#language').val(data.language);
        console.log("Employee data autofilled:", data);

        // Populate roles and access if employee exists
        if (data.primaryRole) {
            // Set primary role
            $('#primaryRole').val(data.primaryRole).trigger('change');

            // Populate primary role access
            setTimeout(() => {
                Object.keys(data.primaryAccess).forEach(field => {
                    const dropdownId = sanitizeId(`${data.primaryRole}${field}`);
                    $(`#${dropdownId}`).val(data.primaryAccess[field]).trigger('change');
                });
            }, 100);

            // Set secondary roles
            if (data.secondaryRoles && data.secondaryRoles.length > 0) {
                $('#secondaryRole').val(data.secondaryRoles).trigger('change');

                // Populate secondary role access
                setTimeout(() => {
                    data.secondaryRoles.forEach(role => {
                        Object.keys(data.secondaryAccess[role]).forEach(field => {
                            const dropdownId = sanitizeId(`${role}${field}`);
                            $(`#${dropdownId}`).val(data.secondaryAccess[role][field]).trigger('change');
                        });
                    });
                }, 200);
            }
        }
    }

    // Populate access fields based on role selection
    function populateRoleDataAccess(role, containerId) {
        console.log(`Populating role data access for role: ${role}, container: ${containerId}`);
        const accessFields = {
            '[CX] Services': {
                fields: ['Episode Name', 'Respondent Type'],
                options: {
                    'Episode Name': [
                        'All',
                        'Basic Inquiry or Information Access',
                        'Certificate or Document Request',
                        'Complaint, Objection, Appeal, Suggestion',
                        'Completing Monthly Contribution Payment',
                        'Completing Voluntary Contribution Payment',
                        'Modification of Administrative Details on Your Profile or Account with GOSI',
                        'Online or Mobile Account Activation',
                        'Other Requests Coming from GOSI',
                        'Receiving the Benefit Payment',
                        'Registration for Core Services',
                        'Requests from GOSI for Compliance or Addressing Violations',
                        'Termination or Suspension of Registration with GOSI',
                        'Value-Added Services & Offers, such as Taqdeer, Events, Experience Paths, Loan Offers'
                    ],
                    'Respondent Type': [
                        'All',
                        'Contributor',
                        'Employer',
                        'Beneficiary'
                    ]
                }
            },
            '[CX] Assisted Channels': {
                fields: ['Channel Name', 'Respondent Type'],
                options: {
                    'Channel Name': [
                        'All',
                        'Customer Service Toll-Free Number',
                        'Live Chat'
                    ],
                    'Respondent Type': [
                        'All',
                        'Contributor',
                        'Employer',
                        'Beneficiary'
                    ]
                }
            },
            '[CX] Self-Service Channels': {
                fields: ['Channel Name', 'Respondent Type'],
                options: {
                    'Channel Name': [
                        'All',
                        'Digital Human (Ask Ameen)',
                        'GOSI Mobile App',
                        'GOSI Individuals Web Portal',
                        'GOSI Business Web Portal'
                    ],
                    'Respondent Type': [
                        'All',
                        'Contributor',
                        'Employer',
                        'Beneficiary'
                    ]
                }
            },
            '[CX] Relationship': {
                fields: ['Respondent Type'],
                options: {
                    'Respondent Type': [
                        'All',
                        'Contributor',
                        'Employer',
                        'Beneficiary'
                    ]
                }
            }
        };

        const noAccessRoles = [
            '[CX] Insights',
            '[EX] Insights',
            '[CX+EX] Insights',
            '[CX] Agents & Processors',
            '[CX] Line Manager',
            '[EX] Line Manager',
            '[EX] Manager of Managers'
        ];

        // Check if the role already exists in the container
        if ($(`#dataAccess${containerId} #role-${sanitizeId(role)}`).length) {
            console.log(`Role ${role} already exists in the container. Skipping.`);
            return;
        }

        if (noAccessRoles.includes(role)) {
            let message = '';
            if (role.includes('Insights')) {
                message = `All ${role} Records`;
            } else {
                message = 'These roles do not require manual data selection. However, their data view is automatically determined by their position within the organizational hierarchy.';
            }
            // Append the message with a unique ID for the role, including a header and horizontal line
            $(`#dataAccess${containerId}`).append(`
                <div id="role-${sanitizeId(role)}">
                    <h5 class="mt-3">${role} Access</h5>
                    <div class="alert alert-info">${message}</div>
                    <hr>
                </div>
            `);
            console.log(`No access fields for role: ${role}, message displayed.`);
        } else if (accessFields[role]) {
            let fieldsHtml = `<div id="role-${sanitizeId(role)}"><h5 class="mt-3">${role} Access</h5>`;
            fieldsHtml += accessFields[role].fields.map(field => `
                <div class="mb-3 row">
                    <label for="${sanitizeId(role + field)}" class="col-form-label col-md-3">${field}</label>
                    <div class="col-md-9">
                        <select class="form-select" multiple="multiple" id="${sanitizeId(role + field)}">
                            ${accessFields[role].options[field].map(option => `<option value="${option}">${option}</option>`).join('')}
                        </select>
                    </div>
                </div>
            `).join('');
            fieldsHtml += `<hr></div>`; // Add a horizontal line at the end

            // Append the fields to the container
            $(`#dataAccess${containerId}`).append(fieldsHtml);
            console.log(`Appended fields to container: #dataAccess${containerId}`);

            // Initialize Select2 for the new dropdowns
            $(`#dataAccess${containerId} select`).select2();

            // Add logic to handle "All" option
            $(`#dataAccess${containerId} select`).on('change', function() {
                const selectedValues = $(this).val();
                if (selectedValues && selectedValues.includes('All')) {
                    $(this).val(['All']).trigger('change'); // Deselect all other options
                }
            });

            console.log("Select2 initialized for new dropdowns.");
        } else {
            console.log(`No access fields found for role: ${role}`);
        }
    }

    // Update secondary role options based on primary role selection
    function updateSecondaryRoleOptions(selectedPrimaryRole) {
        console.log(`Updating secondary role options for primary role: ${selectedPrimaryRole}`);
        const roles = [
            '[CX] Services',
            '[CX] Assisted Channels',
            '[CX] Self-Service Channels',
            '[CX] Relationship',
            '[CX] Insights',
            '[EX] Insights',
            '[CX+EX] Insights',
            '[CX] Agents & Processors',
            '[CX] Line Manager',
            '[EX] Line Manager',
            '[EX] Manager of Managers'
        ];
        const options = roles.filter(role => role !== selectedPrimaryRole).map(role => `<option value="${role}">${role}</option>`).join('');
        $('#secondaryRole').html(options).trigger('change');
        $('#secondaryRoleContainer').removeClass('hidden');
        console.log("Secondary role options updated.");
    }

    // System select change event
    $('#systemSelect').on('change', function() {
        const selectedSystem = $(this).val();
        console.log(`System selected: ${selectedSystem}`);
        toggleMedalliaFields(selectedSystem === "Medallia");
    });

    // Employee ID input event
    $('#employeeId').on('input', function() {
        const employeeId = $(this).val();
        if (employeeId) {
            $('#fetchEmployeeInfo').prop('disabled', false); // Enable the button
        } else {
            $('#fetchEmployeeInfo').prop('disabled', true); // Disable the button
        }
    });

    // Fetch employee information button click event
    $('#fetchEmployeeInfo').on('click', function() {
        const employeeId = $('#employeeId').val();
        if (employeeId) {
            handleEmployeeData(employeeId);
            $('#medalliaFields').removeClass('hidden'); // Show the rest of the form
        }
    });

    // Primary role change event
    $('#primaryRole').on('change', function() {
        const role = $(this).val();
        console.log(`Primary role selected: ${role}`);
        if (role) {
            $('#dataAccessPrimary').empty().removeClass('hidden'); // Clear and show the container
            populateRoleDataAccess(role, 'Primary');
            updateSecondaryRoleOptions(role);
        } else {
            $('#dataAccessPrimary').empty().addClass('hidden'); // Clear and hide the container
            console.log("Primary role container cleared and hidden.");
        }
    });

    // Secondary role change event
    $('#secondaryRole').on('change', function() {
        const roles = $(this).val() || [];
        console.log(`Secondary roles selected: ${roles}`);

        // Remove roles that are no longer selected
        $(`#dataAccessSecondary > div`).each(function() {
            const roleId = $(this).attr('id').replace('role-', '');
            if (!roles.includes(`[${roleId}]`)) {
                $(this).remove(); // Remove the role's content if it's no longer selected
            }
        });

        // Add new roles that are selected
        roles.forEach(role => {
            populateRoleDataAccess(role, 'Secondary');
        });
    });

    // Add a line between primary role data access and secondary role dropdown
    $('#dataAccessPrimary').after('<hr>');
});