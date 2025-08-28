'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import { LifeSphere } from '@/types'

interface SphereSelectorProps {
  spheres: LifeSphere[]
  selectedSpheres: string[]
  onSphereToggle: (sphereId: string) => void
  onSpheresChange: (spheres: LifeSphere[]) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const
    }
  },
  selected: {
    scale: 1.05,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.2,
      ease: "easeOut" as const
    }
  }
}

const checkmarkVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const
    }
  }
}

export const SphereSelector: React.FC<SphereSelectorProps> = ({
  spheres,
  selectedSpheres,
  onSphereToggle,
  onSpheresChange
}) => {
  const [hoveredSphere, setHoveredSphere] = useState<string | null>(null)

  const handleSphereClick = (sphereId: string) => {
    onSphereToggle(sphereId)
  }

  const handleScoreChange = (sphereId: string, newScore: number) => {
    const updatedSpheres = spheres.map(sphere => 
      sphere.id === sphereId 
        ? { ...sphere, score: newScore }
        : sphere
    )
    onSpheresChange(updatedSpheres)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          Выберите сферы жизни
        </h3>
        <p className="text-sm text-secondary-600">
          Отметьте сферы, которые важны для вас
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence>
          {spheres.map((sphere, index) => {
            const isSelected = selectedSpheres.includes(sphere.id)
            const isHovered = hoveredSphere === sphere.id

            return (
              <motion.div
                key={sphere.id}
                variants={itemVariants}
                whileHover="hover"
                animate={isSelected ? "selected" : "visible"}
                onHoverStart={() => setHoveredSphere(sphere.id)}
                onHoverEnd={() => setHoveredSphere(null)}
                className="relative"
              >
                <Card
                  className={`p-4 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'ring-2 ring-primary-500 bg-primary-50' 
                      : 'hover:bg-secondary-50'
                  }`}
                  onClick={() => handleSphereClick(sphere.id)}
                >
                  {/* Чекмарк */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        variants={checkmarkVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center"
                      >
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Иконка сферы */}
                  <div className="text-center mb-3">
                    <motion.div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mx-auto"
                      style={{ 
                        backgroundColor: `${sphere.color}20`,
                        border: `2px solid ${sphere.color}`
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {sphere.icon}
                    </motion.div>
                  </div>

                  {/* Название сферы */}
                  <h4 className="text-sm font-medium text-secondary-900 text-center mb-2">
                    {sphere.name}
                  </h4>

                  {/* Слайдер для оценки */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-secondary-600">Оценка</span>
                        <span className="text-xs font-medium text-secondary-900">
                          {sphere.score}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={sphere.score}
                        onChange={(e) => handleScoreChange(sphere.id, parseInt(e.target.value))}
                        className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, ${sphere.color} 0%, ${sphere.color} ${sphere.score * 10}%, #e5e7eb ${sphere.score * 10}%, #e5e7eb 100%)`
                        }}
                      />
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Статистика выбора */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center mt-6"
      >
        <p className="text-sm text-secondary-600">
          Выбрано: <span className="font-semibold text-primary-600">{selectedSpheres.length}</span> из {spheres.length} сфер
        </p>
      </motion.div>
    </motion.div>
  )
}
