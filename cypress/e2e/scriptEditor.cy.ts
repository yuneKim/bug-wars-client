describe('Script Editor', () => {
  beforeEach(() => {
    cy.visit('/script-editor');
  });

  it('displays an error on mouseover', () => {
    cy.get('.ql-editor').type(':BEG!');
    cy.get('.script-editor-underline-error').trigger('mousemove', 10, 10, { force: true });

    cy.get('.error-title').should(
      'have.text',
      'A label name must only contain uppercase letters, numbers, and underscores.',
    );
  });

  it('inserts a tab when you hit enter after a label or after an indented line', () => {
    cy.get('.ql-editor').type(':BEGIN{enter}att{enter}mov');
    cy.get('.ql-editor').should('have.text', ':BEGIN\tatt\tmov');
  });

  it('displays intellisense when you begin typing a word', () => {
    cy.get('.ql-editor').type('if');
    cy.get('.intellisense').should('be.visible');
    cy.get('.intellisense li').should('have.length', 5);
  });

  it('intellisense completes a word', () => {
    cy.get('.ql-editor').type('if');
    cy.get('.intellisense li').eq(1).click();
    cy.get('.ql-editor').should('have.text', 'ifAlly');

    cy.get('.ql-editor').type('{enter}if{downArrow}{downArrow}{enter}');
    cy.get('.ql-editor').should('have.text', 'ifAllyifFood');
  });

  it('intellisense correct places cursor', () => {
    cy.get('.ql-editor').type(':BEGIN{enter}{enter}{upArrow}if{enter}a');
    cy.get('.ql-editor').should('have.text', ':BEGIN\tifEnemya\t');
    cy.get('.ql-editor').type('{enter}if');
    cy.get('.intellisense-item-list li').eq(2).click();
    cy.get('.ql-editor').type('a');
    cy.get('.ql-editor').should('have.text', ':BEGIN\tifEnemya\tifFooda\t');
  });

  it('intellisense can be cancelled with escape key', () => {
    cy.get('.ql-editor').type('if{esc}En');
    cy.get('.intellisense').should('not.exist');
  });

  it('intellisense is hidden when editing existing word but reappears upon typing', () => {
    cy.get('.ql-editor').type('ifEnemy {backspace}{backspace}{backspace}');
    cy.get('.intellisense').should('not.exist');
    cy.get('.ql-editor').type('m');
    cy.get('.intellisense').should('be.visible');
  });
});
