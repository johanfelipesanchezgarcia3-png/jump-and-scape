// Banco de Preguntas Educativas para "Escapa y Aprende"
const QUESTION_BANK = {
    matematicas: [
        {
            q: "¿Cuál es el resultado de 15 × 8 - 20?",
            options: ["100", "120", "140", "110"],
            answer: 0,
            explanation: "15 × 8 = 120. Luego, 120 - 20 = 100."
        },
        {
            q: "Si un triángulo tiene ángulos de 90° y 45°, ¿cuánto mide el tercer ángulo?",
            options: ["45°", "60°", "30°", "90°"],
            answer: 0,
            explanation: "La suma de los ángulos internos de un triángulo siempre es 180°. 180° - 90° - 45° = 45°."
        },
        {
            q: "¿Cuál es la raíz cuadrada de 144?",
            options: ["14", "12", "16", "10"],
            answer: 1,
            explanation: "12 × 12 = 144."
        },
        {
            q: "¿Cuánto es 3/4 + 2/4 simplificado?",
            options: ["5/4", "5/8", "1 1/4", "6/4"],
            answer: 2,
            explanation: "3/4 + 2/4 = 5/4, lo cual equivale al número mixto 1 1/4."
        },
        {
            q: "Resuelve para x: 3x + 9 = 24",
            options: ["x = 3", "x = 5", "x = 4", "x = 6"],
            answer: 1,
            explanation: "3x = 24 - 9 => 3x = 15 => x = 5."
        },
        {
            q: "¿Cuál es el perímetro de un cuadrado que tiene 7 cm por lado?",
            options: ["14 cm", "28 cm", "49 cm", "21 cm"],
            answer: 1,
            explanation: "Perímetro = 4 × lado = 4 × 7 = 28 cm."
        },
        {
            q: "¿Qué porcentaje representa 25 de 100?",
            options: ["50%", "25%", "2.5%", "250%"],
            answer: 1,
            explanation: "25 de 100 es exactamente el 25%."
        },
        {
            q: "Si lanzas un dado común de 6 caras, ¿cuál es la probabilidad de obtener un número par?",
            options: ["1/3", "1/6", "1/2", "2/3"],
            answer: 2,
            explanation: "Hay 3 números pares (2, 4, 6) de 6 posibles: 3/6 = 1/2 (50%)."
        },
        {
            q: "¿Cuál es la fórmula para calcular el área de un círculo?",
            options: ["π × r²", "2 × π × r", "π × d", "r² / 2"],
            answer: 0,
            explanation: "El área de un círculo se calcula como π multiplicada por el radio al cuadrado (πr²)."
        },
        {
            q: "¿Cuál es el número primo más pequeño?",
            options: ["0", "1", "2", "3"],
            answer: 2,
            explanation: "El 2 es el único número primo par y el más pequeño de todos."
        },
        {
            q: "¿Cuánto es 2 a la quinta potencia (2⁵)?",
            options: ["10", "16", "32", "64"],
            answer: 2,
            explanation: "2 × 2 × 2 × 2 × 2 = 32."
        },
        {
            q: "En la ecuación y = 2x + 5, ¿cuál es la pendiente (m)?",
            options: ["5", "2", "x", "y"],
            answer: 1,
            explanation: "En la forma y = mx + b, la pendiente 'm' es el coeficiente de x, que es 2."
        },
        {
            q: "¿Cuánto es el 20% de 150?",
            options: ["30", "20", "25", "35"],
            answer: 0,
            explanation: "150 × 0.20 = 30."
        },
        {
            q: "¿Cómo se llama un polígono de 8 lados?",
            options: ["Hexágono", "Heptágono", "Octágono", "Pentágono"],
            answer: 2,
            explanation: "Un polígono de 8 lados se denomina octágono."
        },
        {
            q: "Si compras un libro de $80 con un 25% de descuento, ¿cuánto pagas?",
            options: ["$60", "$50", "$65", "$70"],
            answer: 0,
            explanation: "El 25% de 80 es 20. El precio final es $80 - $20 = $60."
        }
    ],
    espanol: [
        {
            q: "¿Qué tipo de palabra es 'rápido' en la frase 'El carro rápido'?",
            options: ["Sustantivo", "Adjetivo", "Verbo", "Adverbio"],
            answer: 1,
            explanation: "'Rápido' modifica al sustantivo 'carro', especificando sus cualidades, por lo tanto es un adjetivo."
        },
        {
            q: "¿Cuál de las siguientes palabras es esdrújula?",
            options: ["Canción", "Música", "Pared", "Árbol"],
            answer: 1,
            explanation: "'Mú-si-ca' lleva el acento en la antepenúltima sílaba y todas las esdrújulas llevan tilde."
        },
        {
            q: "¿Cuál es el sinónimo de la palabra 'Efímero'?",
            options: ["Eterno", "Pasajero", "Brillante", "Antiguo"],
            answer: 1,
            explanation: "'Efímero' significa algo de corta duración o pasajero."
        },
        {
            q: "¿Qué figura literaria consiste en una comparación usando la palabra 'como'?",
            options: ["Metáfora", "Símil", "Hipérbole", "Personificación"],
            answer: 1,
            explanation: "El Símil o Comparación utiliza conectores directos como 'como', 'cual' o 'parecido a'."
        },
        {
            q: "¿Cuál es el sujeto en la oración: 'Ayer por la tarde corrieron los niños en el parque'?",
            options: ["El parque", "Ayer", "Los niños", "La tarde"],
            answer: 2,
            explanation: "¿Quiénes corrieron? 'Los niños' realiza la acción del verbo."
        },
        {
            q: "Identifica el antónimo de 'Abundante':",
            options: ["Escaso", "Copioso", "Suficiente", "Enorme"],
            answer: 0,
            explanation: "Lo opuesto a abundante (que hay mucho) es escaso (que hay poco)."
        },
        {
            q: "¿Cómo se llama la coincidencia de sonidos al final de dos o más versos?",
            options: ["Métrica", "Rima", "Estrofa", "Prosa"],
            answer: 1,
            explanation: "La rima es la igualdad o semejanza de sonidos al final de los versos a partir de la última vocal tónica."
        },
        {
            q: "¿Cuál es la forma correcta del participio del verbo 'Escribir'?",
            options: ["Escribido", "Escrito", "Escribiendo", "Escribiere"],
            answer: 1,
            explanation: "El participio irregular del verbo escribir es 'escrito'."
        },
        {
            q: "¿Qué tipo de oración es: '¡Qué alegría verte de nuevo!'?",
            options: ["Declarativa", "Exclamativa", "Interrogativa", "Imperativa"],
            answer: 1,
            explanation: "Expresa emoción intensa y va entre signos de admiración, es una oración exclamativa."
        },
        {
            q: "Identifica la palabra aguda que debe llevar tilde:",
            options: ["Reloj", "Café", "Pared", "Papel"],
            answer: 1,
            explanation: "'Café' es aguda terminada en vocal, por lo que lleva tilde ortográfica."
        },
        {
            q: "¿Qué función cumple el sustantivo en la oración?",
            options: ["Describir una acción", "Nombrar personas, animales, cosas o ideas", "Conectar oraciones", "Modificar al verbo"],
            answer: 1,
            explanation: "El sustantivo sirve para nombrar entidades reales o abstractas."
        },
        {
            q: "¿Cuál es el prefijo que significa 'debajo de'?",
            options: ["Sub-", "Pre-", "Re-", "Anti-"],
            answer: 0,
            explanation: "El prefijo 'sub-' indica posición inferior o debajo (ej. submarino, subterráneo)."
        },
        {
            q: "¿Qué es un hiato en gramática?",
            options: ["Dos vocales en una misma sílaba", "La unión de consonantes", "La separación de dos vocales en sílabas distintas", "Un tipo de tilde"],
            answer: 2,
            explanation: "El hiato es el encuentro de dos vocales que pertenecen a sílabas diferentes."
        },
        {
            q: "¿Cuál es el plural correcto de la palabra 'Lápiz'?",
            options: ["Lápizes", "Lápices", "Lápiss", "Lápizs"],
            answer: 1,
            explanation: "Las palabras que terminan en 'z' cambian a 'c' al formar el plural terminado en '-ces'."
        },
        {
            q: "¿Qué tipo de texto relata hechos reales o ficticios ocurridos a personajes en un tiempo y lugar determinado?",
            options: ["Texto Instructivo", "Texto Narrativo", "Texto Argumentativo", "Texto Descriptivo"],
            answer: 1,
            explanation: "El texto narrativo relata una secuencia de acontecimientos."
        }
    ],
    biologia: [
        {
            q: "¿Cuál es la unidad básica y fundamental de la vida?",
            options: ["El órgano", "El tejido", "La célula", "La molécula"],
            answer: 2,
            explanation: "La célula es la unidad estructural y funcional primaria de todos los seres vivos."
        },
        {
            q: "¿Qué organelo celular es conocido como el motor de la célula que produce energía (ATP)?",
            options: ["Núcleo", "Mitocondria", "Ribosoma", "Aparato de Golgi"],
            answer: 1,
            explanation: "La mitocondria realiza la respiración celular y sintetiza la mayor parte del ATP."
        },
        {
            q: "¿Cómo se llama el proceso por el cual las plantas convierten la luz solar en alimento?",
            options: ["Respiración", "Fotosíntesis", "Fermentación", "Transpiración"],
            answer: 1,
            explanation: "La fotosíntesis transforma la energía lumínica, agua y CO₂ en glucosa y oxígeno."
        },
        {
            q: "¿Qué pigmento le da el color verde a las plantas?",
            options: ["Hemoglobina", "Melanina", "Clorofila", "Caroteno"],
            answer: 2,
            explanation: "La clorofila se encuentra en los cloroplastos y capta la luz verde de la fotosíntesis."
        },
        {
            q: "¿Cuál es el gas que absorben las plantas durante la fotosíntesis?",
            options: ["Oxígeno", "Dióxido de Carbono (CO₂)", "Nitrógeno", "Metano"],
            answer: 1,
            explanation: "Las plantas consumen Dióxido de Carbono (CO₂) y liberan Oxígeno (O₂)."
        },
        {
            q: "¿Qué molécula contiene las instrucciones genéticas de la mayoría de los organismos vivos?",
            options: ["ARN", "ADN", "Proteína", "Glúcido"],
            answer: 1,
            explanation: "El ADN (Ácido Desoxirribonucleico) porta la información genética hereditaria."
        },
        {
            q: "¿Cuál es el órgano principal del sistema circulatorio humano?",
            options: ["Los pulmones", "El cerebro", "El corazón", "El hígado"],
            answer: 2,
            explanation: "El corazón bombea sangre a todo el cuerpo a través de los vasos sanguíneos."
        },
        {
            q: "¿Cómo se clasifican los animales que no poseen columna vertebral?",
            options: ["Vertebrados", "Invertebrados", "Mamíferos", "Reptiles"],
            answer: 1,
            explanation: "Los invertebrados (ej. insectos, moluscos) carecen de esqueleto óseo o columna."
        },
        {
            q: "¿Qué tipo de organismos se alimentan exclusivamente de plantas?",
            options: ["Carnívoros", "Omnívoros", "Herbívoros", "Descomponedores"],
            answer: 2,
            explanation: "Los herbívoros consumen materia vegetal como fuente de alimento."
        },
        {
            q: "¿Cuál es la capa externa del cuerpo humano que nos protege de microbios y regula la temperatura?",
            options: ["La piel (Tegumento)", "Los músculos", "El periostio", "El endotelio"],
            answer: 0,
            explanation: "La piel es el órgano más grande del cuerpo humano y actúa como barrera protectora."
        },
        {
            q: "¿En qué órgano humano se produce la bilis?",
            options: ["Estómago", "Hígado", "Páncreas", "Vesícula"],
            answer: 1,
            explanation: "El hígado sintetiza la bilis para ayudar en la digestión de las grasas."
        },
        {
            q: "¿Qué nombre recibe el conjunto de organismos de la misma especie que habitan un lugar en un tiempo determinado?",
            options: ["Comunidad", "Población", "Ecosistema", "Biosfera"],
            answer: 1,
            explanation: "Una población es un grupo de individuos de la misma especie en un área definida."
        },
        {
            q: "¿Cuál es el proceso de división celular que produce gametos (óvulos y espermatozoides)?",
            options: ["Mitosis", "Meiosis", "Bipartición", "Esporulaciones"],
            answer: 1,
            explanation: "La meiosis reduce a la mitad el número de cromosomas para formar células sexuales."
        },
        {
            q: "¿Qué sistema del cuerpo humano se encarga de defendernos contra infecciones y enfermedades?",
            options: ["Sistema Endocrino", "Sistema Inmunológico", "Sistema Nervioso", "Sistema Excretor"],
            answer: 1,
            explanation: "El sistema inmunitario o inmunológico reconoce y combate gérmenes e patógenos."
        },
        {
            q: "¿Cómo se les llama a los organismos capaces de producir su propio alimento?",
            options: ["Heterótrofos", "Autótrofos", "Parásitos", "Descomponedores"],
            answer: 1,
            explanation: "Los autótrofos (como las plantas y algas) sintetizan sus nutrientes por fotosíntesis o quimiosíntesis."
        }
    ],
    ingles: [
        {
            q: "What is the correct past tense of the verb 'to go'?",
            options: ["Goed", "Gone", "Went", "Going"],
            answer: 2,
            explanation: "'Go' is an irregular verb. Its past tense is 'went'."
        },
        {
            q: "Choose the correct pronoun: 'Mary is reading ___ favorite book.'",
            options: ["his", "her", "its", "their"],
            answer: 1,
            explanation: "'Mary' is female singular, so we use the possessive adjective 'her'."
        },
        {
            q: "What is the opposite (antonym) of the word 'Ancient'?",
            options: ["Old", "Modern", "Classic", "Historic"],
            answer: 1,
            explanation: "'Ancient' means extremely old, so its opposite is 'Modern'."
        },
        {
            q: "Select the correct plural form of 'Child':",
            options: ["Childs", "Childrens", "Children", "Childes"],
            answer: 2,
            explanation: "'Child' has an irregular plural form: 'Children'."
        },
        {
            q: "Complete the sentence: 'Listen! The birds ___ singing happily in the trees.'",
            options: ["is", "are", "was", "be"],
            answer: 1,
            explanation: "'Birds' is plural, so we use the Present Continuous auxiliary 'are'."
        },
        {
            q: "Which word is a synonym for 'Happy'?",
            options: ["Sad", "Joyful", "Angry", "Tired"],
            answer: 1,
            explanation: "'Joyful' means experiencing or expressing happiness."
        },
        {
            q: "Complete the question: '___ is your favorite color?'",
            options: ["Where", "Who", "What", "When"],
            answer: 2,
            explanation: "'What' is used to ask about things, concepts, or preferences."
        },
        {
            q: "Choose the correct preposition: 'The cat is sleeping ___ the table.'",
            options: ["under", "between", "during", "into"],
            answer: 0,
            explanation: "'Under' indicates a position directly below something."
        },
        {
            q: "What is the comparative form of the adjective 'Big'?",
            options: ["More big", "Bigger", "Biggest", "Biger"],
            answer: 1,
            explanation: "Short one-syllable adjectives ending in consonant-vowel-consonant double the last letter: 'Bigger'."
        },
        {
            q: "Identify the correct sentence in Present Perfect:",
            options: [
                "I lived in Paris two years ago.",
                "I am living in Paris right now.",
                "I have lived in Paris for two years.",
                "I will live in Paris next year."
            ],
            answer: 2,
            explanation: "Present Perfect uses 'have/has + past participle': 'I have lived'."
        },
        {
            q: "What does the idiom 'Piece of cake' mean?",
            options: ["Something very tasty", "Something very easy", "Something expensive", "A birthday gift"],
            answer: 1,
            explanation: "'A piece of cake' is an English idiom meaning a task is very simple or easy to do."
        },
        {
            q: "Choose the correct option: 'If it rains tomorrow, we ___ stay at home.'",
            options: ["would", "will", "did", "have"],
            answer: 1,
            explanation: "First conditional structure: If + Present Simple, Will + base verb."
        },
        {
            q: "Which of these words is a noun?",
            options: ["Quickly", "Beautiful", "Knowledge", "Run"],
            answer: 2,
            explanation: "'Knowledge' (conocimiento) is an abstract noun."
        },
        {
            q: "What is the English translation of 'Desafío'?",
            options: ["Goal", "Challenge", "Reward", "Success"],
            answer: 1,
            explanation: "'Challenge' translates to 'desafío' or 'reto' in Spanish."
        },
        {
            q: "Select the correctly spelled word:",
            options: ["Neccessary", "Necessary", "Necesary", "Neccesary"],
            answer: 1,
            explanation: "'Necessary' is spelled with 1 'c' and 2 's's."
        }
    ]
};
