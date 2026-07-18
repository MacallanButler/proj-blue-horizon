class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self

  enum :role, { diver: 0, staff: 1, admin: 2 }, default: :diver
  enum :padi_cert_level, { open_water: 0, advanced: 1, rescue: 2, divemaster: 3, instructor: 4 }

  has_many :bookings, dependent: :destroy
  has_many :rsvps, dependent: :destroy
  has_many :course_enrollments, dependent: :destroy
  has_many :log_entries, dependent: :destroy

  has_one_attached :cert_card_photo

  validates :name, presence: true
  validates :role, presence: true

  # JWT JTI generation
  before_create :generate_jti

  private

  def generate_jti
    self.jti ||= SecureRandom.uuid
  end
end
