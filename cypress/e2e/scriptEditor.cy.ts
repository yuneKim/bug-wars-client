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
});
