<div class="settings-wrapper">
    <p>
        <% if (readOnlyEmail) { %>
            We'll get back to you at this address if we missed you.
        <% } else { %>
            You can leave us your email so that we can get back to you this way.
        <% } %>
    </p>
    <form data-ui-form>
        <div class="input-group">
            <i class="fa fa-envelope-o before-icon"></i>
            <input type="text" placeholder="Your email address" class="input email-input" data-ui-email>
        </div>

        <% if (!readOnlyEmail) { %>
            <div class="input-group">
                <button type="button" class="btn btn-sk-primary" data-ui-save>Save</button>
                <span class="form-message" data-ui-form-message></span>
            </div>
        <% } %>
    </form>
</div>