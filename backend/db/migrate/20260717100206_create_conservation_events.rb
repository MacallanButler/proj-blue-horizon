class CreateConservationEvents < ActiveRecord::Migration[8.1]
  def change
    create_table :conservation_events do |t|
      t.string :title
      t.text :description
      t.integer :event_type
      t.date :date
      t.string :location
      t.integer :capacity

      t.timestamps
    end
  end
end
