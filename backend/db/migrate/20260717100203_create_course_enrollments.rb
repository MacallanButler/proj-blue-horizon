class CreateCourseEnrollments < ActiveRecord::Migration[8.1]
  def change
    create_table :course_enrollments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :course, null: false, foreign_key: true
      t.integer :status
      t.integer :deposit_paid_cents
      t.integer :balance_due_cents
      t.string :stripe_payment_intent_id
      t.string :stripe_balance_intent_id

      t.timestamps
    end
  end
end
