class CreateImpactStats < ActiveRecord::Migration[8.1]
  def change
    create_table :impact_stats do |t|
      t.integer :coral_fragments_planted
      t.integer :co2_offset_kg
      t.integer :marine_animals_tagged
      t.integer :conservation_fund_cents

      t.timestamps
    end
  end
end
