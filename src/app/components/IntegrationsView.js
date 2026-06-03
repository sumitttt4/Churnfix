import React, { useState } from "react";
import { Mail, Terminal, Info, Save, Layers, ArrowUpRight, HelpCircle } from "lucide-react";

const SlackIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    {...props}
  >
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.824 5.043a2.528 2.528 0 0 1-2.52-2.522A2.528 2.528 0 0 1 8.824 0a2.528 2.528 0 0 1 2.52 2.521v2.522H8.824zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522H3.782a2.528 2.528 0 0 1-2.522-2.522V8.824a2.528 2.528 0 0 1 2.522-2.52h5.042zm10.134 3.761a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522h-2.522v-2.522zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52H10.13a2.528 2.528 0 0 1-2.52-2.52V5.043a2.528 2.528 0 0 1 2.52-2.522h5.044a2.528 2.528 0 0 1 2.52 2.522v5.042zm-3.76 10.134a2.528 2.528 0 0 1 2.52 2.522 2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.522h2.522zm0-1.262a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.52h5.042a2.528 2.528 0 0 1 2.522 2.52v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.042z" />
  </svg>
);

export default function IntegrationsView({
  connectedProcessors,
  onToggleProcessor,
  alertSettings,
  onSaveAlertSettings,
  emailTemplate,
  onSaveEmailTemplate,
  currentTier,
  onUpgradePrompt,
  addToast
}) {
  const [stripeSecret, setStripeSecret] = useState("sk_test_••••••••••••••••••••");
  const [polarToken, setPolarToken] = useState("polar_tok_••••••••••••••••••••");
  const [lemonApiKey, setLemonApiKey] = useState("ls_api_••••••••••••••••••••");
  const [paddleApiKey, setPaddleApiKey] = useState("paddle_api_••••••••••••••••••••");

  const [slackEnabled, setSlackEnabled] = useState(alertSettings.slackEnabled);
  const [slackWebhook, setSlackWebhook] = useState(alertSettings.slackWebhook);
  const [discordEnabled, setDiscordEnabled] = useState(alertSettings.discordEnabled);
  const [discordWebhook, setDiscordWebhook] = useState(alertSettings.discordWebhook);
  const [emailEnabled, setEmailEnabled] = useState(alertSettings.emailEnabled);
  const [emailAddress, setEmailAddress] = useState(alertSettings.emailAddress);

  const [emailSubject, setEmailSubject] = useState(emailTemplate.subject);
  const [emailBody, setEmailBody] = useState(emailTemplate.body);

  const handleConnectProcessor = (processor) => {
    const connectedCount = Object.values(connectedProcessors).filter(Boolean).length;
    const isCurrentlyConnected = connectedProcessors[processor];

    if (!isCurrentlyConnected) {
      if (currentTier === "free" && connectedCount >= 1) {
        onUpgradePrompt("The Free tier is limited to 1 billing stack. Upgrade to Growth ($29/mo) to connect up to 3 stacks.");
        return;
      }
      if (currentTier === "growth" && connectedCount >= 3) {
        onUpgradePrompt("The Growth tier supports up to 3 billing stacks. Upgrade to Scale ($59/mo) to monitor unlimited stacks.");
        return;
      }
    }

    onToggleProcessor(processor);
    
    addToast({
      title: isCurrentlyConnected ? "Stack Disconnected" : "Stack Connected",
      message: `${processor.charAt(0).toUpperCase() + processor.slice(1)} dunning webhook monitor has been ${isCurrentlyConnected ? "deactivated" : "activated"}.`,
      type: isCurrentlyConnected ? "warning" : "success"
    });
  };

  const handleSaveAlerts = (e) => {
    e.preventDefault();
    onSaveAlertSettings({
      slackEnabled,
      slackWebhook,
      discordEnabled,
      discordWebhook,
      emailEnabled,
      emailAddress
    });
    addToast({
      title: "Alert Settings Saved",
      message: "Webhook triggers and email notification recipients successfully updated.",
      type: "success"
    });
  };

  const handleSaveEmail = () => {
    onSaveEmailTemplate({
      subject: emailSubject,
      body: emailBody
    });
    addToast({
      title: "Email Template Saved",
      message: "Dunning recovery templates successfully saved. Live email tests will use this design.",
      type: "success"
    });
  };

  const insertPlaceholder = (tag) => {
    setEmailBody(prev => prev + ` ${tag} `);
  };

  const getParsedPreview = (bodyText) => {
    return bodyText
      .replace(/{{customer_name}}/g, "Sumit Kumar")
      .replace(/{{amount}}/g, "$29.00")
      .replace(/{{billing_platform}}/g, "Stripe")
      .replace(/{{recovery_link}}/g, "https://churnfix.com/recover/inv_82ksjd");
  };

  const parsedSubject = emailSubject
    .replace(/{{customer_name}}/g, "Sumit Kumar")
    .replace(/{{amount}}/g, "$29.00")
    .replace(/{{billing_platform}}/g, "Stripe");

  return (
    <div className="flex flex-col gap-8">
      
      {/* Billing Stacks Section */}
      <div className="bg-neutral-surface border border-border-clean rounded-sharp p-6">
        <div className="border-b border-border-clean pb-4 mb-6">
          <h3 className="font-display font-bold text-lg text-navy">Billing Stacks</h3>
          <p className="text-xs text-muted-text mt-0.5 font-medium">Connect your billing processors to automatically listen to failed payment webhooks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stripe */}
          <div className="border border-border-clean rounded-sharp p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-sharp bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <button
                  className={`py-1.5 px-3 text-xs font-bold rounded-sharp cursor-pointer transition-colors ${
                    connectedProcessors.stripe 
                      ? "border border-border-clean text-navy hover:border-navy" 
                      : "bg-primary text-neutral-surface hover:bg-primary-hover"
                  }`}
                  onClick={() => handleConnectProcessor("stripe")}
                >
                  {connectedProcessors.stripe ? "Disconnect" : "Connect"}
                </button>
              </div>
              <h4 className="font-display font-bold text-navy">Stripe</h4>
              <p className="text-xs text-muted-text mt-2 leading-relaxed">
                Monitors Stripe invoice payment failures, retry events, and past-due subscriptions.
              </p>
            </div>
            {connectedProcessors.stripe && (
              <div className="mt-4 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Secret Key</label>
                <input
                  type="password"
                  className="w-full border border-border-clean rounded-sharp px-2.5 py-1 text-xs focus:border-primary focus:outline-none"
                  value={stripeSecret}
                  onChange={(e) => setStripeSecret(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Polar */}
          <div className="border border-border-clean rounded-sharp p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-sharp bg-navy/10 text-navy flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <button
                  className={`py-1.5 px-3 text-xs font-bold rounded-sharp cursor-pointer transition-colors ${
                    connectedProcessors.polar 
                      ? "border border-border-clean text-navy hover:border-navy" 
                      : "bg-primary text-neutral-surface hover:bg-primary-hover"
                  }`}
                  onClick={() => handleConnectProcessor("polar")}
                >
                  {connectedProcessors.polar ? "Disconnect" : "Connect"}
                </button>
              </div>
              <h4 className="font-display font-bold text-navy">Polar</h4>
              <p className="text-xs text-muted-text mt-2 leading-relaxed">
                Monitors Polar subscription events, payment failures, and automatically syncs customer billing.
              </p>
            </div>
            {connectedProcessors.polar && (
              <div className="mt-4 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Access Token</label>
                <input
                  type="password"
                  className="w-full border border-border-clean rounded-sharp px-2.5 py-1 text-xs focus:border-primary focus:outline-none"
                  value={polarToken}
                  onChange={(e) => setPolarToken(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Lemon Squeezy */}
          <div className="border border-border-clean rounded-sharp p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-sharp bg-[#7047EB]/10 text-[#7047EB] flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <button
                  className={`py-1.5 px-3 text-xs font-bold rounded-sharp cursor-pointer transition-colors ${
                    connectedProcessors.lemonsqueezy 
                      ? "border border-border-clean text-navy hover:border-navy" 
                      : "bg-primary text-neutral-surface hover:bg-primary-hover"
                  }`}
                  onClick={() => handleConnectProcessor("lemonsqueezy")}
                >
                  {connectedProcessors.lemonsqueezy ? "Disconnect" : "Connect"}
                </button>
              </div>
              <h4 className="font-display font-bold text-navy">Lemon Squeezy</h4>
              <p className="text-xs text-muted-text mt-2 leading-relaxed">
                Captures LemonSqueezy subscription updates and notifies on failed card payments.
              </p>
            </div>
            {connectedProcessors.lemonsqueezy && (
              <div className="mt-4 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider">API Key</label>
                <input
                  type="password"
                  className="w-full border border-border-clean rounded-sharp px-2.5 py-1 text-xs focus:border-primary focus:outline-none"
                  value={lemonApiKey}
                  onChange={(e) => setLemonApiKey(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Paddle */}
          <div className="border border-border-clean rounded-sharp p-6 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-sharp bg-[#141C36]/10 text-[#141C36] flex items-center justify-center">
                  <Layers size={18} />
                </div>
                <button
                  className={`py-1.5 px-3 text-xs font-bold rounded-sharp cursor-pointer transition-colors ${
                    connectedProcessors.paddle 
                      ? "border border-border-clean text-navy hover:border-navy" 
                      : "bg-primary text-neutral-surface hover:bg-primary-hover"
                  }`}
                  onClick={() => handleConnectProcessor("paddle")}
                >
                  {connectedProcessors.paddle ? "Disconnect" : "Connect"}
                </button>
              </div>
              <h4 className="font-display font-bold text-navy">Paddle</h4>
              <p className="text-xs text-muted-text mt-2 leading-relaxed">
                Handles Paddle webhook subscription alerts, payment failures, and transaction triggers.
              </p>
            </div>
            {connectedProcessors.paddle && (
              <div className="mt-4 flex flex-col gap-1">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider">Vendor API Key</label>
                <input
                  type="password"
                  className="w-full border border-border-clean rounded-sharp px-2.5 py-1 text-xs focus:border-primary focus:outline-none"
                  value={paddleApiKey}
                  onChange={(e) => setPaddleApiKey(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Alerts Configuration */}
        <div className="lg:col-span-6 bg-neutral-surface border border-border-clean rounded-sharp p-6">
          <div className="border-b border-border-clean pb-4 mb-6">
            <h3 className="font-display font-bold text-lg text-navy">Slack & Discord Alerts</h3>
            <p className="text-xs text-muted-text mt-0.5 font-medium">Broadcast immediate revenue alert updates to team channels</p>
          </div>

          <form onSubmit={handleSaveAlerts} className="flex flex-col gap-6">
            {/* Slack */}
            <div className={`p-4 border rounded-sharp transition-colors ${slackEnabled ? "border-primary/20 bg-primary-light/10" : "border-border-clean"}`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <SlackIcon style={{ color: "#E01E5A" }} className="flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-navy">Slack Notifications</div>
                    <div className="text-xs text-muted-text">Send payment failures to Slack</div>
                  </div>
                </div>
                <input
                  id="slack-toggle"
                  type="checkbox"
                  checked={slackEnabled}
                  onChange={(e) => setSlackEnabled(e.target.checked)}
                  style={{ accentColor: "var(--color-primary)" }}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
              {slackEnabled && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider" htmlFor="slack-webhook-field">Webhook URL</label>
                  <input
                    id="slack-webhook-field"
                    type="url"
                    className="w-full border border-border-clean rounded-sharp px-3 py-1.5 text-xs bg-neutral-surface focus:border-primary focus:outline-none"
                    placeholder="https://hooks.slack.com/services/..."
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {/* Discord */}
            <div className={`p-4 border rounded-sharp transition-colors ${discordEnabled ? "border-primary/20 bg-primary-light/10" : "border-border-clean"}`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <Terminal size={18} style={{ color: "#5865F2" }} className="flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-navy">Discord Notifications</div>
                    <div className="text-xs text-muted-text">Send payment failures to Discord</div>
                  </div>
                </div>
                <input
                  id="discord-toggle"
                  type="checkbox"
                  checked={discordEnabled}
                  onChange={(e) => setDiscordEnabled(e.target.checked)}
                  style={{ accentColor: "var(--color-primary)" }}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
              {discordEnabled && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider" htmlFor="discord-webhook-field">Webhook URL</label>
                  <input
                    id="discord-webhook-field"
                    type="url"
                    className="w-full border border-border-clean rounded-sharp px-3 py-1.5 text-xs bg-neutral-surface focus:border-primary focus:outline-none"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {/* Email */}
            <div className={`p-4 border rounded-sharp transition-colors ${emailEnabled ? "border-primary/20 bg-primary-light/10" : "border-border-clean"}`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary flex-shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-navy">Dunning Emails</div>
                    <div className="text-xs text-muted-text">Send recovery emails to customers</div>
                  </div>
                </div>
                <input
                  id="email-toggle"
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  style={{ accentColor: "var(--color-primary)" }}
                  className="w-4 h-4 cursor-pointer"
                />
              </div>
              {emailEnabled && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-navy uppercase tracking-wider" htmlFor="support-email-field">Sender Domain Support Email</label>
                  <input
                    id="support-email-field"
                    type="email"
                    className="w-full border border-border-clean rounded-sharp px-3 py-1.5 text-xs bg-neutral-surface focus:border-primary focus:outline-none"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-neutral-surface text-xs font-bold py-2.5 px-4 rounded-sharp transition-colors w-fit align-self-end border-none cursor-pointer"
            >
              <Save size={14} className="inline mr-1.5" /> Save Alert Settings
            </button>
          </form>
        </div>

        {/* Email Template Editor */}
        <div className="lg:col-span-6 bg-neutral-surface border border-border-clean rounded-sharp p-6">
          <div className="border-b border-border-clean pb-4 mb-6">
            <h3 className="font-display font-bold text-lg text-navy">Customer Recovery Template</h3>
            <p className="text-xs text-muted-text mt-0.5 font-medium">Design the notification customers receive when a card payment declines</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-navy uppercase tracking-wider" htmlFor="email-subject-field">Subject Line</label>
              <input
                id="email-subject-field"
                type="text"
                className="w-full border border-border-clean rounded-sharp px-3 py-2 text-sm bg-neutral-surface focus:border-primary focus:outline-none"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-navy uppercase tracking-wider" htmlFor="email-body-field">Email Body</label>
                <div className="flex gap-1.5">
                  <button type="button" className="text-[10px] font-bold bg-primary-light text-primary hover:bg-primary/20 px-2 py-0.5 rounded-sharp border-none cursor-pointer" onClick={() => insertPlaceholder("{{customer_name}}")}>+ Name</button>
                  <button type="button" className="text-[10px] font-bold bg-primary-light text-primary hover:bg-primary/20 px-2 py-0.5 rounded-sharp border-none cursor-pointer" onClick={() => insertPlaceholder("{{amount}}")}>+ Amount</button>
                  <button type="button" className="text-[10px] font-bold bg-primary-light text-primary hover:bg-primary/20 px-2 py-0.5 rounded-sharp border-none cursor-pointer" onClick={() => insertPlaceholder("{{billing_platform}}")}>+ Platform</button>
                  <button type="button" className="text-[10px] font-bold bg-primary-light text-primary hover:bg-primary/20 px-2 py-0.5 rounded-sharp border-none cursor-pointer" onClick={() => insertPlaceholder("{{recovery_link}}")}>+ Link</button>
                </div>
              </div>
              <textarea
                id="email-body-field"
                className="w-full border border-border-clean rounded-sharp px-3 py-2 text-xs bg-neutral-surface focus:border-primary focus:outline-none"
                style={{ height: "110px", resize: "none", lineHeight: "1.4" }}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </div>

            {/* Email Preview Box */}
            <div className="border border-border-clean rounded-sharp overflow-hidden flex flex-col bg-neutral-bg">
              <div className="p-3 bg-neutral-surface border-b border-border-clean text-[11px] leading-relaxed">
                <div>
                  <span className="font-bold text-muted-text mr-1">From:</span>
                  <span>{emailAddress || "billing@churnfix.com"}</span>
                </div>
                <div className="mt-0.5">
                  <span className="font-bold text-muted-text mr-1">Subject:</span>
                  <span className="font-semibold text-navy">{parsedSubject}</span>
                </div>
              </div>
              <div className="p-4 bg-neutral-surface m-3 border border-border-clean rounded-sharp shadow-none text-xs text-navy leading-relaxed whitespace-pre-wrap">
                {getParsedPreview(emailBody)}
              </div>
            </div>

            <button
              type="button"
              className="bg-primary hover:bg-primary-hover text-neutral-surface text-xs font-bold py-2.5 px-4 rounded-sharp transition-colors w-fit align-self-end border-none cursor-pointer"
              onClick={handleSaveEmail}
            >
              <Save size={14} className="inline mr-1.5" /> Save Template
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
