import { html, nothing } from "lit";
import type { ChatProps } from "./chat";
import { renderChat } from "./chat";

export type TaxChatProps = ChatProps;

export function renderTaxChat(props: TaxChatProps) {
  // Render the standard chat view
  const chatView = renderChat(props);
  
  // TaxChat is a simplified chat view with the standard layout
  // The key difference is that this view is context-specific to taxchat session
  // and presents a cleaner UI focused on tax-specific interactions.
  // We'll wrap it in a simple container that emphasizes the chat interface.
  
  return html`
    <div class="taxchat-container">
      ${chatView}
    </div>
  `;
}
