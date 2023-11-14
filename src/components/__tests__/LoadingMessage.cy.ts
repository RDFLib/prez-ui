import LoadingMessage from "@/components/LoadingMessage.vue";

describe("LoadingMessage", () => {
    it("is mounted", () => {
        cy.mount(LoadingMessage);
        cy.get("span").should("have.text", "Loading...");
    });
});
