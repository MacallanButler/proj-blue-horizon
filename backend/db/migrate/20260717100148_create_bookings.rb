class CreateBookings < ActiveRecord::Migration[8.1]
  def change
    create_table :bookings do |t|
      t.references :user, null: true, foreign_key: true
      t.references :trip, null: false, foreign_key: true
      t.string :guest_name
      t.string :guest_email
      t.string :guest_phone
      t.text :gear_selections
      t.text :extras
      t.integer :conservation_fee_cents
      t.integer :total_cents
      t.integer :status
      t.string :stripe_payment_intent_id

      t.timestamps
    end
  end
end
