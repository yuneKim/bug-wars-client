describe('Script Editor', () => {
  it('displays an error on mouseover', () => {
    cy.visit('/script-editor');

    cy.get('.ql-editor').type(':BEG!');
    cy.get('.script-editor-underline-error').trigger('mousemove', 10, 10, { force: true });

    cy.get('.error-title').should(
      'have.text',
      'A label name must only contain uppercase letters, numbers, and underscores.',
    );
  });
});
