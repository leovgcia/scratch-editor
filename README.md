# scratch-editor
Editor para generar precompilados en mi ecosistema.

Pasa algo, que el precompilado o los hilos no deberían ser creados porque sí, el usuario primero tiene que crear su maqueta, llenar de sus respectivos datos y finalmente disparar la construcción del precompilado. Ahora mismo no hace eso, así como arrastras los bloques se crea en fa el precompilado (sin haberles rellenado); eso está del nabo, ¿no?

Primero fue prestarle atención al bloque del tipo definidor, acabo de terminar esta vez con el bloque del tipo condicional, sólo faltaría hacerle caso a los bloques del tipo variable y en los bloques que cuentan con inputs, poderse rellenar desde bloques del tipo variable.

Em, también falta corregir esa necedad que tienen los bloques definidores por incorporarse al source. Por suerte ya se rechazan a nivel canvas, pero si se intenta poner un bloque definidor en uno condicional, sí lo acepta y truena la secuencia. 

Tengo un detalle, una vez añadido un bloque condicional, todo el hilo se castiga a escribirse bajo ese mismo. Explico: al arrastrar un bloque condicional, de ese para abajo todos los bloques tienen un level +1, y yo necesito seguir metiendo lógica fuera del bloque condicional (ojo, pero sin discriminar los bloques dentro del bloque condicional, no sé si entiendan).