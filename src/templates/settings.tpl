<div class="settings-wrapper">
    <p>
        <% if (readOnlyEmail) { %>
            <%= settingsReadOnlyText %>
        <% } else { %>
            <%= settingsText %>
        <% } %>
    </p>
    <form data-ui-form>
        <div class="input-group">
            <i class="fa fa-envelope-o before-icon"></i>
            <input type="text" placeholder="<%= settingsInputPlaceholder %>" class="input email-input" data-ui-email>
        </div>

        <% if (!readOnlyEmail) { %>
            <div class="input-group">
                <button type="button" class="btn btn-sk-primary" data-ui-save><%= settingsSaveButtonText %></button>
                <span class="form-message" data-ui-form-message></span>
            </div>
        <% } %>
    </form>
</div>
