class CreateRsvps < ActiveRecord::Migration[8.1]
  def change
    create_table :rsvps do |t|
      t.references :user, null: true, foreign_key: true
      t.references :conservation_event, null: false, foreign_key: true
      t.string :guest_name
      t.string :guest_email
      t.boolean :attended, null: false, default: false

      t.timestamps
    end
  end
end
