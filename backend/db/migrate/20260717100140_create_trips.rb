class CreateTrips < ActiveRecord::Migration[8.1]
  def change
    create_table :trips do |t|
      t.references :dive_site, type: :string, null: false, foreign_key: true
      t.date :date
      t.string :departure_time
      t.integer :capacity
      t.integer :required_cert_level

      t.timestamps
    end
  end
end
